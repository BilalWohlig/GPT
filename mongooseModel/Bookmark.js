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
        status: {
            type: String,
            enum: ["Enabled", "Disabled"],
            default: "Disabled",
            required: true
        }
    },
    {
        timestamps: true
    }
)
export default mongoose.model("Bookmark", schema)
