var schema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        day: {
            type: Number
        },
        month: {
            type: Number
        },
        year: {
            type: Number
        },
        hour: {
            type: Number
        },
        min: {
            type: Number
        },
        lat: {
            type: Number
        },
        lon: {
            type: Number
        },
        sunSign: {
            type: String
        },
        tzone: {
            type: Number
        }
    },
    {
        timestamps: true
    }
)
export default mongoose.model("Astrology", schema)
