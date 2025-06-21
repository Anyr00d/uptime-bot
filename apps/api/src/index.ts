import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import monitorRoutes from "./routes/monitor"
import { startScheduler } from "./scheduler";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api",monitorRoutes);
startScheduler();

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
