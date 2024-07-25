import app from "./app.js";
import { config } from "dotenv";
config();
import connectToDB from "./config/db.js";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  await connectToDB();
  console.log("backend is running at : ", PORT);
});
