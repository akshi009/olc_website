import mongoose from "mongoose"

const profileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, required: true }
}, {
    timestamps: true
})

export default mongoose.model("Profile", profileSchema, "profile_collection")