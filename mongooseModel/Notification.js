var schema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        status: {
            type: String,
            enum: ["enabled", "disabled"],
            default: "enabled"
        },
        dailyCount: {
            type: Number,
            default: 10
        }
    },
    {
        timestamps: true
    }
)
export default mongoose.model("Notification", schema)
