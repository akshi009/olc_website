import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
dotenv.config();

const googleConfig = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET_ID,
    "postmessage" // VERY IMPORTANT for auth-code popup flow
);

export default googleConfig;