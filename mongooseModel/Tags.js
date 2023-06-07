var schema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        news: {
            type: Schema.Types.ObjectId,
            ref: "News",
            required: true
        },
        language: {
            type: Schema.Types.ObjectId,
            ref: "Language",
            required: true
        }
    },
    {
        timestamps: true
    }
)
export default mongoose.model("Tag", schema)
