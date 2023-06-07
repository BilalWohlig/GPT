var schema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        birth_moon_sign: {
            type: String
        },
        birth_moon_nakshatra: {
            type: String
        },
        prediction: {
            type: Object
        },
        prediction_date: {
            type: String
        }
    },
    {
        timestamps: true
    }
)
export default mongoose.model("Prediction", schema)
