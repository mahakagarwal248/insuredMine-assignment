import schedule from "node-schedule";
import MessageModel from "../models/message.js";

export const saveMessage = async (req, res) => {
  try {
    const { message, day, time } = req.body;
    const date = new Date(`${day} ${time}`);
    schedule.scheduleJob(date, async function () {
      const savedMessage = await MessageModel.create({ message });
      console.log(savedMessage);
    });
    return res.status(200).json({ message: "Message Scheduled successfully" });
  } catch (error) {
    return res.status(500).json({ message: error?.message });
  }
};
