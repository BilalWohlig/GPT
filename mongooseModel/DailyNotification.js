var schema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        notificationCount: {
            type: Number,
            default: 1,
            required: true
        },
        notificationSentTime: {
            type: Date,
            default: Date.now,
            required: true
        }
    },
    {
        timestamps: true
    }
)
export default mongoose.model("DailyNotification", schema)
