var schema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        languages: [
            {
                type: Schema.Types.ObjectId,
                ref: "Language",
                required: true
            }
        ],
        vendors: [
            {
                type: Schema.Types.ObjectId,
                ref: "Vendor",
                required: true
            }
        ],
        status: {
            type: String,
            enum: ["enabled", "disabled"],
            default: "enabled",
            index: true
        },
        order: {
            type: Number,
            index: true
        }
    },
    {
        timestamps: true
    }
)
export default mongoose.model("Category", schema)
