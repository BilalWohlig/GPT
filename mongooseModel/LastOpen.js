var schema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        lastAppOpenTime: {
            type: Date
        }
    },
    {
        timestamps: true
    }
)
export default mongoose.model("LastOpen", schema)
