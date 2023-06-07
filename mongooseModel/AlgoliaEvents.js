var schema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        newsId: {
            type: Schema.Types.ObjectId,
            ref: "News",
            required: true
        },
        eventName: {
            type: String,
            enum: ["Time Spent", "Share", "Source"],
            required: true
        },
        eventType: {
            type: String,
            enum: ["conversion", "view", "click"],
            required: true
        }
    },
    {
        timestamps: true
    }
)
export default mongoose.model("AlgoliaEvent", schema)
