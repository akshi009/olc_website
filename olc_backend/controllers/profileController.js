import Profile from "../model/profile.js";
export const createProfile = async (req, res) => {
    try {
        const { userId, address, phone, role } = req.body;
        const profile = await Profile.create({
            userId,
            address,
            phone,
            role
        })
        res.status(200).json({
            message: "success",
            profile
        })
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

export const getProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const profile = await Profile.findOne({ userId }).populate("userId", "name", "email")
        if (!profile) {
            return res.status(404).json({
                message: "Profile not found"
            })
        }
        res.status(200).json({
            message: "success",
            profile
        })
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const { address, phone, role } = req.body;
        const profile = await Profile.findOne({ userId })
        if (!profile) {
            return res.status(404).json({
                message: "Profile not found"
            })
        }
        profile.address = address;
        profile.phone = phone;
        profile.role = role;
        await profile.save();
        res.status(200).json({
            message: "success",
            profile
        })
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

export const deleteProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const profile = await Profile.findOneAndDelete({ userId })
        if (!profile) {
            return res.status(404).json({
                message: "Profile not found"
            })
        }
        res.status(200).json({
            message: "success",
            profile
        })
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

