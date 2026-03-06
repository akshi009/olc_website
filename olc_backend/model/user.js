import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        name: String,
        email: { type: String, unique: true },
        image: String,
        role: { type: String, enum: ["customer", "admin"], default: "customer" },
        googleId: { type: String },
    },
    { timestamps: true }
);

export default mongoose.models.User ||
    mongoose.model("User", UserSchema);
