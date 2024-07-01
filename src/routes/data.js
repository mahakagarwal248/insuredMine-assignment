import multer from "multer";
import express from "express";
import {
  getAllPolicyData,
  getPolicyData,
  saveData,
} from "../controllers/data.js";

const app = express();
const router = express.Router();
const storage = multer.diskStorage({
  destination: "/files",
});
var upload = multer({ storage: storage });
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

router.route("/").post(upload.single("file"), saveData).get(getAllPolicyData);

router.get("/by-username", getPolicyData);

export default router;
