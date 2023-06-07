const branchio = require("branchio-sdk")

const client = branchio({
    key: process.env.BRANCH_IO_KEY,
    secret: process.env.BRANCH_IO_SECRET
})
export default {
    sendNewsToBranchIO: async (news) => {
        try {
            const { url } = await client.link({
                data: {
                    $og_title: news.headline,
                    $og_description: news.summary,
                    id: news._id,
                    $og_image_url: news.imgixUrlHighRes,
                    $ios_nativelink: true,
                    $always_deeplink: true,
                    $canonical_url: `${process.env.WEB_URL}/news/${news._id}`,
                    $deeplink_path: `${process.env.WEB_URL}/news/${news._id}`,
                    $fallback_url: `${process.env.WEB_URL}/news/${news._id}`
                }
            })
            return url
        } catch (error) {
            console.log(error.message)
            return error
        }
    }
}
