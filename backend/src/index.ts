import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import monitorRoutes from "./routes/monitor";
import { startScheduler } from "./scheduler";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.get("/api", function (req, res) {
  res.json({
    msg: "This is CORS-enabled for all origins! This route is healthy!",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/url", monitorRoutes);
startScheduler();

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
