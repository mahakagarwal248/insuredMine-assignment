import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import useragent from "express-useragent";
import helmet from "helmet";
import path from "path";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import http from "http";
import routes from "../src/routes/index.js";
import { fileURLToPath } from "url";
import { getUsage } from "../src/helpers/getCpuUsage.js";
import { restartServer } from "../src/helpers/restartServer.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

app.use(express.static("public"));

app.use("/node", express.static(path.resolve(__dirname, "../../node/")));

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "500kb" }));

app.use(useragent.express());

app.use(cookieParser());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
const corsOption = {
  credentials: true,
  origin: [
    process.env.FRONT_URL,
    process.env.DASHBOARD_URL,
    "http://localhost:3000",
  ],
};
app.use(cors(corsOption));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Prevent parameter pollution
app.use(hpp());

const intervalTime = setInterval(async () => {
  const cpuUsage = await getUsage();
  console.log("CPU usage ->", Number(cpuUsage));
  if (Number(cpuUsage) > 70) {
    clearInterval(intervalTime);
    server.close(() => {
      restartServer();
    });
  }
}, 5000);

// mount all routes on /api path
app.use("/node/api/", routes);

app.all("*", (req, res) => {
  return res.status(404).json({
    error: `Can't find ${req.originalUrl} on this server!`,
  });
});

export default server;
