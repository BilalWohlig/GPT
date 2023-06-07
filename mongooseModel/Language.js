var schema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["enabled", "disabled"],
            default: "enabled",
            index: true
        },
        code: {
            type: String,
            required: true
        },
        lingualText: {
            type: String,
            required: true
        },
        vendor: [
            {
                type: Schema.Types.ObjectId,
                ref: "Vendor"
            }
        ],
        order: {
            type: Number
        }
    },
    {
        timestamps: true
    }
)
export default mongoose.model("Language", schema)
