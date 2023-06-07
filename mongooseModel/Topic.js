var schema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["Enabled", "Disabled"],
            default: "Enabled",
            required: true
        },
        order: {
            type: Number,
            required: true
        },
        image: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
)
export default mongoose.model("Topic", schema)
