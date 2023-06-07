var schema = new Schema(
    {
        keyword: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["blocked", "unblocked"],
            default: "blocked",
            index: true,
            required: true
        },
        keywordType: {
            type: String,
            enum: ["ads", "horoscope"]
        }
    },
    {
        timestamps: true
    }
)
// schema.index({ name: 1, email: 1 }, { unique: true })
export default mongoose.model("BlockedKeyword", schema)
