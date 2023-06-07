var schema = new Schema(
    {
        sourceName: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["blocked", "enabled"],
            default: "blocked",
            index: true,
            required: true
        }
    },
    {
        timestamps: true
    }
)
// schema.index({ name: 1, email: 1 }, { unique: true })
export default mongoose.model("BlockedSource", schema)
