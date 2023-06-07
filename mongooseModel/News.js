var schema = new Schema(
    {
        headline: {
            type: String
        },
        gnewsTitle: {
            type: String
        },
        fullContent: {
            type: String
        },
        summary: {
            type: String
        },
        points: {
            type: String
        },
        tweet: {
            type: String
        },
        tags: {
            type: String
        },
        bullets: {
            type: String
        },
        modelId: {
            type: String
        },
        modelStatus: {
            type: String
        },
        company: {
            type: String
        },
        newsLink: {
            type: String,
            required: true
        },
        image: {
            type: String,
            default: ""
            // required: true
        },
        s3ImgUrl: {
            type: String,
            default: ""
        },
        imgixUrlLowRes: {
            type: String,
            default: ""
        },
        imgixUrlHighRes: {
            type: String,
            default: ""
        },
        categories: [
            {
                type: Schema.Types.ObjectId,
                ref: "Category"
            }
        ],
        publishTime: {
            type: Date,
            required: true,
            default: Date.now
        },
        source: {
            type: String
        },
        vendor: {
            type: Schema.Types.ObjectId,
            ref: "Vendor"
        },
        language: {
            type: Schema.Types.ObjectId,
            ref: "Language"
        },
        // sampleQnA: {
        //     type: Array,
        // },
        status: {
            type: String,
            default: "pending",
            enum: [
                "pending",
                "goneToGPT",
                "gptError",
                "gptSuccess",
                "s3Error",
                "ready",
                "readyForReview",
                "published",
                "rejected",
                "blocked",
                "repeated",
                "horoscope",
                "ads",
                "other"
            ]
        },
        shareLink: {
            type: String
        },
        gptContent: {
            type: String
        },
        gptLogs: {
            type: Object
        },
        sentiment: {
            type: String,
            enum: ["Positive", "Negative", "Neutral"]
        },
        reviewed: {
            type: Boolean
        },
        reviewedBy: {
            type: Schema.Types.ObjectId,
            ref: "Admin"
        },
        rejectReason: {
            type: String
        },
        imageEnhanced: {
            type: Boolean
        },
        imageEnhancedBy: {
            type: Schema.Types.ObjectId,
            ref: "Admin"
        },
        imageEnhancedUrl: {
            type: String
        },
        imageEnhanceds3Url: {
            type: String
        },
        imageEnhancedApproved: {
            type: Boolean
        }
    },
    {
        timestamps: true
    }
)
export default mongoose.model("News", schema)
