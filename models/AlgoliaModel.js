const algoliasearch = require("algoliasearch")
const client = algoliasearch(
    process.env.ALGOLIA_APP_ID,
    process.env.ALGOLIA_ADMIN_API_KEY
)
export default {
    sendAlgoliaDataForOneObject: async (newsItem) => {
        var newIndex
        if (newsItem.language.name == "English") {
            newIndex = client.initIndex("news")
        } else {
            newIndex = client.initIndex(
                `news_${newsItem.language.name.toLowerCase()}`
            )
        }
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
        const categoryArray = []
        for (let i = 0; i < newsItem.categories.length; i++) {
            const categoryId = newsItem.categories[i]
            const catObj = await Category.findOne({ _id: categoryId })
            categoryArray.push(catObj.name)
        }
        const newsObj = {
            _id: newsItem._id,
            objectID: newsItem._id,
            newsLink: newsItem.newsLink,
            fullContent: newsItem.fullContent,
            summary: newsItem.summary,
            headline: newsItem.headline,
            tags: newsItem.tags,
            bullets: newsItem.bullets,
            categories: categoryArray,
            publishTime: newsItem.publishTime,
            source: newsItem.source,
            imgixUrlLowRes: newsItem.imgixUrlLowRes,
            imgixUrlHighRes: newsItem.imgixUrlHighRes,
            shareLink: newsItem.shareLink,
            sentiment: newsItem.sentiment
        }
        for (let i = 0; i < (tags.length >= 5 ? 5 : tags.length); i++) {
            newsObj[`tag${i + 1}`] = tags[i]
                .replace(/([a-z])([A-Z])/g, "$1 $2")
                .split(" ")
                .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                .join(" ")
        }
        const newPublishTime = Math.floor(
            new Date(newsObj.publishTime).getTime() / 1000
        )
        newsObj.publishTime = newPublishTime
        await newIndex.saveObject(newsObj)
    }
}
