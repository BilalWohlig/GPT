/**
 * Add Cron Here. Refer https://www.npmjs.com/package/node-cron
 * cron.schedule('* * * * *', () => {
 * console.log('running a task every minute')
 * });
 */

if (process.env.gptCron) {
    console.log("GPT CRONS ARE ACTIVE")
    cron.schedule("5,25,45 * * * *", async () => {
        try {
            console.log("GPT Running", new Date().toLocaleString())
            // let pineconeArr = []
            const keywords = await BlockedKeyword.find({ status: "blocked" })
            const news = await News.find({ status: "pending" })
                .populate("language")
                .exec()
            await News.updateMany(
                { status: "pending" },
                { status: "goneToGPT" }
            )
            for (let newsItem of news) {
                if (!newsItem.image) {
                    newsItem.status = "noImage"
                    console.lg("No Image")
                    await newsItem.save()
                    continue
                }
                // check if this news already exists in the database
                const sameNews = await News.findOne({
                    $and: [
                        {
                            $or: [
                                { newsLink: newsItem.newsLink },
                                { fullContent: newsItem.fullContent }
                            ]
                        },
                        {
                            $or: [{ status: "ready" }, { reviewed: true }]
                        }
                    ]
                }).exec()
                if (sameNews) {
                    console.log("Same News")
                    newsItem.status = "repeated"
                    await newsItem.save()
                    continue
                }
                const allCategories = await Category.find({
                    status: "enabled",
                    languages: {
                        $in: [newsItem.language]
                    },
                    name: { $ne: "breaking-news" }
                }).sort({
                    order: 1
                })
                const updatedCategories = allCategories.map((category, i) => {
                    return `${i + 1}. ${category.name}`
                })
                let GPTContent = await axios.post(
                    `${process.env.GPT_SERVER_LINK}/askus/api/gpt/getNewsFromGPT`,
                    {
                        context:
                            newsItem.language.name == "English"
                                ? newsItem.fullContent
                                : newsItem.newsLink,
                        lang: newsItem.language.name
                    }
                )
                if (
                    GPTContent.status == 200 &&
                    GPTContent.data.msg == "Success" &&
                    GPTContent.data.code == 2000 &&
                    !GPTContent.data.error &&
                    GPTContent.data.data &&
                    GPTContent.data.data.gpt &&
                    GPTContent.data.data.gpt.usage &&
                    GPTContent.data.data.gpt.choices &&
                    GPTContent.data.data.gpt.choices[0] &&
                    GPTContent.data.data.gpt.choices[0].message &&
                    GPTContent.data.data.gpt.choices[0].message.content
                ) {
                    const gptLogs = GPTContent.data.data.gpt.usage
                    GPTContent =
                        GPTContent.data.data.gpt.choices[0].message.content
                    GPTContent = GPTContent.toString()
                    GPTContent = GPTContent.replace(/(\r\n|\n|\r)/gm, "")
                    if (
                        !GPTContent.includes(
                            "Request failed with status code"
                        ) &&
                        !(
                            GPTContent.includes("Sorry") &&
                            GPTContent.includes(`${newsItem.language.name}`) &&
                            GPTContent.includes("English")
                        )
                    ) {
                        if (newsItem.language.name == "English") {
                            const summary = "Summary:"
                            const headline = "Headline:"
                            const tweet = "Tweet:"
                            const tags = "Tags:"
                            const bullets = "Bullets:"

                            const summaryStart =
                                GPTContent.indexOf("Summary:") +
                                summary.length +
                                1
                            const summaryEnd = GPTContent.indexOf("Headline:")
                            let actualSummary = GPTContent.substring(
                                summaryStart,
                                summaryEnd
                            )

                            const headlineStart =
                                GPTContent.indexOf("Headline:") +
                                headline.length +
                                1
                            const headlineEnd = GPTContent.indexOf("Tweet:")
                            let actualHeadline = GPTContent.substring(
                                headlineStart,
                                headlineEnd
                            )

                            const tweetStart =
                                GPTContent.indexOf("Tweet:") + tweet.length + 1
                            const tweetEnd = GPTContent.indexOf("Tags:")
                            let actualTweet = GPTContent.substring(
                                tweetStart,
                                tweetEnd
                            )

                            const tagsStart =
                                GPTContent.indexOf("Tags:") + tags.length + 1
                            const tagsEnd = GPTContent.indexOf("Bullets:")
                            let actualTags = GPTContent.substring(
                                tagsStart,
                                tagsEnd
                            )

                            const bulletsStart =
                                GPTContent.indexOf("Bullets:") +
                                bullets.length +
                                1
                            let actualBullets =
                                GPTContent.substring(bulletsStart)

                            actualSummary = actualSummary.trim()
                            actualHeadline = actualHeadline.trim()
                            actualTweet = actualTweet.trim()
                            actualTags = actualTags.trim()
                            actualBullets = actualBullets.trim()

                            actualSummary = actualSummary.replace(
                                /(\r\n|\n|\r)/gm,
                                ""
                            )
                            actualHeadline = actualHeadline.replace(
                                /(\r\n|\n|\r)/gm,
                                ""
                            )
                            actualTweet = actualTweet.replace(
                                /(\r\n|\n|\r)/gm,
                                ""
                            )
                            actualTags = actualTags.replace(
                                /(\r\n|\n|\r)/gm,
                                ""
                            )
                            let classification = await axios.post(
                                `${process.env.GPT_SERVER_LINK}/askus/api/gpt/getClassificationGPT`,
                                {
                                    summary: actualSummary,
                                    headline: actualHeadline,
                                    categories: updatedCategories
                                }
                            )

                            if (
                                classification.status == 200 &&
                                classification.data.msg == "Success" &&
                                classification.data.code == 2000 &&
                                !classification.data.error &&
                                classification.data.data &&
                                classification.data.data.gpt &&
                                classification.data.data.gpt.usage &&
                                classification.data.data.gpt.choices &&
                                classification.data.data.gpt.choices[0] &&
                                classification.data.data.gpt.choices[0]
                                    .message &&
                                classification.data.data.gpt.choices[0].message
                                    .content
                            ) {
                                classification =
                                    classification.data.data.gpt.choices[0]
                                        .message.content
                                classification = classification.toString()
                                classification = classification.replace(
                                    /(\r\n|\n|\r)/gm,
                                    ""
                                )

                                if (
                                    !classification.includes(
                                        "Request failed with status code"
                                    )
                                ) {
                                    const categories = "Categories:"
                                    const sentiment = "Sentiment:"

                                    const categoryStart =
                                        classification.indexOf("Categories:") +
                                        categories.length +
                                        1
                                    const categoryEnd =
                                        classification.indexOf("Sentiment:")
                                    let actualCategories =
                                        classification.substring(
                                            categoryStart,
                                            categoryEnd
                                        )
                                    const sentimentStart =
                                        classification.indexOf("Sentiment:") +
                                        sentiment.length +
                                        1
                                    var actualSentiment =
                                        classification.substring(sentimentStart)

                                    actualCategories = actualCategories.replace(
                                        /(\r\n|\n|\r)/gm,
                                        ""
                                    )
                                    actualSentiment = actualSentiment.replace(
                                        /(\r\n|\n|\r)/gm,
                                        ""
                                    )
                                    if (
                                        actualSentiment.includes("positive") ||
                                        actualSentiment.includes("Positive")
                                    ) {
                                        actualSentiment = "Positive"
                                    } else if (
                                        actualSentiment.includes("negative") ||
                                        actualSentiment.includes("Negative")
                                    ) {
                                        actualSentiment = "Negative"
                                    } else {
                                        actualSentiment = "Neutral"
                                    }
                                    actualCategories =
                                        actualCategories.split(",")
                                    for (
                                        let i = 0;
                                        i < actualCategories.length;
                                        i++
                                    ) {
                                        actualCategories[i] =
                                            actualCategories[i].trim()
                                    }
                                    const allCategoriesNames =
                                        allCategories.map((category) => {
                                            return category.name
                                        })
                                    const newsCategories =
                                        newsItem.categories.map((category) => {
                                            return category.toString()
                                        })
                                    for (
                                        let i = 0;
                                        i < actualCategories.length;
                                        i++
                                    ) {
                                        const category = actualCategories[i]
                                        if (
                                            allCategoriesNames.includes(
                                                category
                                            )
                                        ) {
                                            const catFromMongoDB = _.find(
                                                allCategories,
                                                (ele) => {
                                                    if (
                                                        ele.name == category &&
                                                        ele.status == "enabled"
                                                    ) {
                                                        return true
                                                    }
                                                }
                                            )
                                            if (
                                                !newsCategories.includes(
                                                    catFromMongoDB._id.toString()
                                                )
                                            ) {
                                                newsItem.categories.push(
                                                    catFromMongoDB._id
                                                )
                                            }
                                        }
                                    }
                                }
                            }
                            newsItem.summary = actualSummary
                            newsItem.headline = actualHeadline
                            newsItem.tweet = actualTweet
                            newsItem.tags = actualTags
                            newsItem.bullets = actualBullets
                            newsItem.sentiment = actualSentiment
                        } else {
                            const summary = "Summary:"
                            const headline = "Headline:"
                            const tags = "Tags:"

                            const summaryStart =
                                GPTContent.indexOf("Summary:") + summary.length
                            const summaryEnd = GPTContent.indexOf("Headline:")
                            let actualSummary = GPTContent.substring(
                                summaryStart,
                                summaryEnd
                            )

                            const headlineStart =
                                GPTContent.indexOf("Headline:") +
                                headline.length
                            const headlineEnd = GPTContent.indexOf("Tags:")
                            let actualHeadline = GPTContent.substring(
                                headlineStart,
                                headlineEnd
                            )

                            const tagsStart =
                                GPTContent.indexOf("Tags:") + tags.length
                            let actualTags = GPTContent.substring(tagsStart)

                            actualSummary = actualSummary.trim()
                            actualHeadline = actualHeadline.trim()
                            actualTags = actualTags.trim()

                            actualSummary = actualSummary.replace(
                                /(\r\n|\n|\r)/gm,
                                ""
                            )
                            actualHeadline = actualHeadline.replace(
                                /(\r\n|\n|\r)/gm,
                                ""
                            )
                            actualTags = actualTags.replace(
                                /(\r\n|\n|\r)/gm,
                                ""
                            )
                            let classification = await axios.post(
                                `${process.env.GPT_SERVER_LINK}/askus/api/gpt/getClassificationGPT`,
                                {
                                    summary: actualSummary,
                                    headline: actualHeadline,
                                    categories: updatedCategories
                                }
                            )

                            if (
                                classification.status == 200 &&
                                classification.data.msg == "Success" &&
                                classification.data.code == 2000 &&
                                !classification.data.error &&
                                classification.data.data &&
                                classification.data.data.gpt &&
                                classification.data.data.gpt.usage &&
                                classification.data.data.gpt.choices &&
                                classification.data.data.gpt.choices[0] &&
                                classification.data.data.gpt.choices[0]
                                    .message &&
                                classification.data.data.gpt.choices[0].message
                                    .content
                            ) {
                                classification =
                                    classification.data.data.gpt.choices[0]
                                        .message.content
                                classification = classification.toString()
                                classification = classification.replace(
                                    /(\r\n|\n|\r)/gm,
                                    ""
                                )

                                if (
                                    !classification.includes(
                                        "Request failed with status code"
                                    )
                                ) {
                                    const categories = "Categories:"
                                    const sentiment = "Sentiment:"

                                    const categoryStart =
                                        classification.indexOf("Categories:") +
                                        categories.length +
                                        1
                                    const categoryEnd =
                                        classification.indexOf("Sentiment:")
                                    let actualCategories =
                                        classification.substring(
                                            categoryStart,
                                            categoryEnd
                                        )
                                    const sentimentStart =
                                        classification.indexOf("Sentiment:") +
                                        sentiment.length +
                                        1
                                    var actualSentiment =
                                        classification.substring(sentimentStart)

                                    actualCategories = actualCategories.replace(
                                        /(\r\n|\n|\r)/gm,
                                        ""
                                    )
                                    actualSentiment = actualSentiment.replace(
                                        /(\r\n|\n|\r)/gm,
                                        ""
                                    )
                                    if (
                                        actualSentiment.includes("positive") ||
                                        actualSentiment.includes("Positive")
                                    ) {
                                        actualSentiment = "Positive"
                                    } else if (
                                        actualSentiment.includes("negative") ||
                                        actualSentiment.includes("Negative")
                                    ) {
                                        actualSentiment = "Negative"
                                    } else {
                                        actualSentiment = "Neutral"
                                    }
                                    actualCategories =
                                        actualCategories.split(",")
                                    for (
                                        let i = 0;
                                        i < actualCategories.length;
                                        i++
                                    ) {
                                        actualCategories[i] =
                                            actualCategories[i].trim()
                                    }
                                    const allCategoriesNames =
                                        allCategories.map((category) => {
                                            return category.name
                                        })
                                    const newsCategories =
                                        newsItem.categories.map((category) => {
                                            return category.toString()
                                        })
                                    for (
                                        let i = 0;
                                        i < actualCategories.length;
                                        i++
                                    ) {
                                        const category = actualCategories[i]
                                        if (
                                            allCategoriesNames.includes(
                                                category
                                            )
                                        ) {
                                            const catFromMongoDB = _.find(
                                                allCategories,
                                                (ele) => {
                                                    if (
                                                        ele.name == category &&
                                                        ele.status == "enabled"
                                                    ) {
                                                        return true
                                                    }
                                                }
                                            )
                                            if (
                                                !newsCategories.includes(
                                                    catFromMongoDB._id.toString()
                                                )
                                            ) {
                                                newsItem.categories.push(
                                                    catFromMongoDB._id
                                                )
                                            }
                                        }
                                    }
                                }
                            }
                            newsItem.summary = actualSummary
                            newsItem.headline = actualHeadline
                            newsItem.tags = actualTags
                            newsItem.sentiment = actualSentiment
                        }
                        newsItem.status = "gptSuccess"
                        newsItem.gptContent = GPTContent
                        newsItem.gptLogs = gptLogs
                        let tags
                        if (newsItem.tags.charAt(0) != "#") {
                            tags = newsItem.tags.split(",")
                        } else {
                            tags = newsItem.tags.split("#")
                        }
                        for (let i = 0; i < tags.length; i++) {
                            if (tags[i].length == 0) {
                                tags.splice(i, 1)
                                i--
                            } else {
                                tags[i] = tags[i].trim()
                            }
                        }
                        let saveTagsObject = []
                        for (
                            let i = 0;
                            i < (tags.length >= 5 ? 5 : tags.length);
                            i++
                        ) {
                            saveTagsObject.push({
                                name: tags[i]
                                    .replace((/([a-z])([A-Z])/g, "$1 $2"))
                                    .split(" ")
                                    .map((word) => {
                                        return (
                                            word[0].toUpperCase() +
                                            word.substr(1).toLowerCase()
                                        )
                                    })
                                    .join(" "),
                                news: newsItem._id,
                                language: newsItem.language
                            })
                        }
                        try {
                            await TagsModel.insertMany(saveTagsObject)
                        } catch (error) {
                            console.error("tags", error.message)
                        }
                        try {
                            try {
                                const shareLink =
                                    await BranchIOModel.sendNewsToBranchIO(
                                        newsItem
                                    )
                                newsItem.shareLink = shareLink
                            } catch (error) {
                                console.error("shareLink", error.message)
                            }
                            await newsItem.save()
                            if (newsItem.image && newsItem.image != "") {
                                try {
                                    const newImageData = await axios.post(
                                        `${process.env.FILE_UPLOAD_URL}/askus/api/image/downloadImageCreateS3Url`,
                                        {
                                            imgUrl: newsItem.image
                                        }
                                    )
                                    if (
                                        newImageData.status == 200 &&
                                        newImageData.data.msg == "Success" &&
                                        newImageData.data.code == 2000 &&
                                        !newImageData.data.error &&
                                        newImageData.data.data &&
                                        newImageData.data.data.result
                                    ) {
                                        try {
                                            newsItem.s3ImgUrl =
                                                newImageData.data.data.result.s3Url
                                            newsItem.imgixUrlLowRes =
                                                newImageData.data.data.result.imagekitUrlLowRes
                                            newsItem.imgixUrlHighRes =
                                                newImageData.data.data.result.imagekitUrlHighRes
                                            newsItem.status = "ready"
                                            const dummyHeadline =
                                                newsItem.headline.toLowerCase()
                                            let actualKeyword = ""
                                            for (
                                                let i = 0;
                                                i < keywords.length;
                                                i++
                                            ) {
                                                const ele = keywords[i]
                                                if (
                                                    dummyHeadline.includes(
                                                        ele.keyword.toLowerCase()
                                                    )
                                                ) {
                                                    actualKeyword = ele
                                                    break
                                                }
                                            }
                                            if (actualKeyword != "") {
                                                console.log(
                                                    "Keyword Status: ",
                                                    actualKeyword.keywordType
                                                )
                                                newsItem.status =
                                                    actualKeyword.keywordType
                                            }
                                            await newsItem.save()
                                            console.log("Done")
                                            if (actualKeyword == "") {
                                                await AlgoliaModel.sendAlgoliaDataForOneObject(
                                                    newsItem
                                                )
                                            }
                                            // if (
                                            //     newsItem.language.name ==
                                            //     "English"
                                            // ) {
                                            //     pineconeArr.push(newsItem)
                                            // }
                                            console.log("Algolia Done")
                                        } catch (error) {
                                            console.log("s3 error", error)
                                        }
                                    }
                                } catch (error) {
                                    console.log("Image Not Saved", error)
                                    try {
                                        newsItem.status = "s3Error"
                                        await newsItem.save()
                                    } catch (error) {
                                        console.log("s3 error saving", error)
                                    }
                                }
                            } else {
                                newsItem.s3ImgUrl = ""
                                newsItem.imgixUrlLowRes = ""
                                newsItem.imgixUrlHighRes = ""
                                newsItem.status = "noImage"
                                await newsItem.save()
                                console.log("Done")
                            }
                        } catch (error) {
                            console.error("saving error", error)
                        }
                    } else {
                        newsItem.status = "gptError"
                        try {
                            await newsItem.save()
                        } catch (error) {
                            console.error("error saving error", error)
                        }
                        console.log("Error")
                    }
                }
            }
            // if (pineconeArr.length > 0) {
            //     await PineconeModel.pushDataToPinconeIndex(pineconeArr)
            // }
            console.log("GPT cron ended")
        } catch (error) {
            console.error("ERRORRR ", error)
        }
    })
}
