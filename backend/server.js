import express from "express";
import cors from "cors";
import multer from "multer";
import { mainsend } from "./chunkz.js";
import { mainretrieve } from "./retrieve.js";
import dotenv from 'dotenv';
dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN_PRIVATE;
const channelId = process.env.channelId_PRIVATE;

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer();

const port = process.env.PORT || 8000;

app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = req.file.buffer;
    const fileName = req.file.originalname;

    const { fileHash, fileSize } = await mainsend(channelId, BOT_TOKEN, file);
    
    res.status(200).json({ fileName, fileHash, fileSize});
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "Failed to upload file" });
  }
});

app.get("/api/retrieve/:fileHash", async (req, res) => {
  try {
    const { fileHash } = req.params;
    const { fileSize , fileName} = req.query;

    const file = await mainretrieve(channelId, fileHash, BOT_TOKEN, fileSize);

    console.log(fileName);

    res.status(200).send(file);
  } catch (error) {
    console.error("Error retrieving file:", error);
    res.status(500).json({ error: "Failed to retrieve file" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
