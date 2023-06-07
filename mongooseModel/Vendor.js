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
        }
    },
    {
        timestamps: true
    }
)
export default mongoose.model("Vendor", schema)
