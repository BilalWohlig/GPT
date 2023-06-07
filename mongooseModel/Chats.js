var schema = new Schema(
    {
        newsId: {
            type: Schema.Types.ObjectId,
            ref: "News",
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        question: {
            type: String,
            required: true
        },
        answer: {
            type: String
        },
        status: {
            type: String,
            enum: ["pending", "completed", "error", "archived"],
            defualt: "pending",
            required: true
        },
        keywords: {
            type: Array
        },
        sortedKeywords: {
            type: Array
        },
        chatLogs: {
            type: Object
        }
    },
    {
        timestamps: true
    }
)
// schema.index({ name: 1, email: 1 }, { unique: true })
export default mongoose.model("Chats", schema)
