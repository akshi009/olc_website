import axios from "axios";
import jwt from "jsonwebtoken";
import User from "../model/user.js";
import googleConfig from "../util/googleConfig.js";

const googleLogin = async (req, res) => {
    try {
        const code = req.query.code;
        const googleRes = await googleConfig.getToken(code);
        googleConfig.setCredentials(googleRes.tokens);
        const userRes = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
        );
        const { email, name, picture, id } = userRes.data;
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
                image: picture,
                googleId: id,
            });
        }
        const { _id } = user;
        const token = jwt.sign({ _id, email },
            process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_TIMEOUT,
        });
        res.status(200).json({
            message: 'success',
            token,
            user,
        });
    } catch (err) {
        console.log(err.response?.data || err);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }

}

export default googleLogin;