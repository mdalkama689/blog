import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import cors from "cors";
import { config } from "dotenv";
config();

const app = express();
const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
};
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(bodyParser.json());
app.get("/hello-world", (req, res) => {
  res.status(400).send("<h1>hello world!</h1>");
});

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/post", postRoutes);
app.get("*", (req, res) => {
  res.status(400).send("<h1>Page not found!</h1>");
});
export default app;
