import { Client, GatewayIntentBits } from "discord.js";
import crypto from "crypto";

const intents = [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages];

// const BOT_TOKEN =
// "MTIxNzE5MzM1ODc2MjQ0NjkzMA.Geh3-D.syQvVIhhHDZzmVfhs7aULYVeF1E1xBIFbIY0-A";
// const channelId = "1220025255691554906";
// const filePath = "video.mp4";

//Reading the file and creating a hash

async function readFileAndHash(data) {
  try {
    // const data = await fsPromises.readFile(filePath); //Need to change this as the file is already there
    const fileHash = crypto.createHash("sha256").update(data).digest("hex");
    return { fileHash };
  } catch (err) {
    console.error("Error reading file:", err.message);
  }
}

//Making chunks and sending them to the server

async function divideAndSendFile(channel, chunkSize, data) {
  const { fileHash } = await readFileAndHash(data); //Need to change this as the file is already there
  const numChunks = Math.ceil(data.length / chunkSize);
  const chunks = [];

  for (let i = 0; i < numChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, data.length);
    chunks.push({
      data: data.slice(start, end),
      sequence: i + 1,
    });
  }

  for (const chunk of chunks) {
    await channel.send({
      files: [
        {
          attachment: Buffer.from(chunk.data),
          name: `chunk-${chunk.sequence}.txt`,
        },
      ],
      content: `**File Hash:** ${fileHash}`,
    });
  }

  console.log("File chunks sent successfully as attachments.");
  return fileHash;
}

//The mainsend function

export async function mainsend(channelId, BOT_TOKEN, file) {
  const chunkSize = 1024 * 1024 * 23; //Denotes 2MB pieces
  const client = new Client({ intents });
  const fileSize = file.byteLength;

  return new Promise((resolve, reject) => {
    client.once("ready", async () => {
      console.log("Bot is ready!");
      try {
        const channel = await client.channels.fetch(channelId);
        const fileHash = await divideAndSendFile(channel, chunkSize, file);
        console.log("File chunks sent successfully.");
        resolve({ fileHash, fileSize });
      } catch (error) {
        console.error("Error sending file:", error.message);
        reject(error);
      } finally {
        client.destroy();
      }
    });

    client.login(BOT_TOKEN);
  });
}