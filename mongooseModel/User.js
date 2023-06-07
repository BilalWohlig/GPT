var schema = new Schema(
    {
        auth0: {
            type: Object,
            required: true
        },
        type: {
            type: String,
            enum: ["google", "apple", "mobile", "device"]
        },
        status: {
            type: String,
            enum: ["enabled", "disabled", "archived"],
            default: "enabled",
            index: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        playerId: {
            type: Array
        },
        language: {
            type: Schema.Types.ObjectId,
            ref: "Language"
        },
        blockedSources: {
            type: Array
        },
        deviceId: {
            type: String
        },
        categories: [
            {
                type: Schema.Types.ObjectId,
                ref: "Category"
            }
        ]
    },
    {
        timestamps: true
    }
)

// schema.index({ name: 1, email: 1 }, { unique: true })
export default mongoose.model("User", schema)
