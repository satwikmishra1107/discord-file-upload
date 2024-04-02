import express from "express";
import cors from "cors";
import multer from "multer";
import { mainsend } from "./chunkz.js";
import { mainretrieve } from "./retrieve.js";

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer();

const port = 8000;

app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { BOT_TOKEN, channelId } = req.query;

    const file = req.file.buffer;
    const fileName = req.file.originalname;

    const { fileHash, fileSize } = await mainsend(channelId, BOT_TOKEN, file);

    res.status(200).json({ fileName, fileHash, fileSize });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "Failed to upload file" });
  }
});

app.get("/api/retrieve/:fileHash", async (req, res) => {
  try {
    const { fileHash } = req.params;
    const { fileSize, fileName, botToken, channelId } = req.query;

    const file = await mainretrieve(channelId, fileHash, botToken, fileSize);

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
