import { Client, GatewayIntentBits } from "discord.js";
import fsPromises from "fs/promises";
import fetch from "node-fetch";

const intents = [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
];

// const BOT_TOKEN =
//   "MTIxNzE5MzM1ODc2MjQ0NjkzMA.Geh3-D.syQvVIhhHDZzmVfhs7aULYVeF1E1xBIFbIY0-A";
// const channelId = "1219719049165144204";
// const fileSize = 12186888;
// const fileHash =
//   "1aa31d8ea0e916039d05948be2341f6b85b52b7412bc14e90793cc97603c2da0";

async function downloadAttachment(url) {
  try {
    // console.log(url);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const buffer = Buffer.from(await response.arrayBuffer());

    return buffer;
  } catch (error) {
    console.error("Error downloading attachment:", error);
  }
}

async function retrieveAndReassembleFile(channel, targetFileHash, fileSize) {
  try {
    let messages = [];
    let lastRetrievedMessageId = null;
    let file = Buffer.alloc(0);
    while (file.byteLength < fileSize) {
      const fetchedMessages = await channel.messages.fetch({
        limit: 100,
        after: lastRetrievedMessageId,
        search: `File Hash: ${targetFileHash}`,
      });

      messages = [...messages, ...fetchedMessages.values()];
      lastRetrievedMessageId = fetchedMessages.last().id;

      for (const message of messages) {
        try {
          if (message.content === `**File Hash:** ${targetFileHash}`) {
            const attachment = message.attachments.first();
            // console.log(attachment.content)
            const chunkData = await downloadAttachment(attachment.url);
            file = Buffer.concat([chunkData, file]);
            console.log(file.byteLength);
            // console.log(file.byteLength,attachment.url)
            if (file.byteLength >= fileSize) break;
          }
        } catch (error) {
          console.error("Error downloading chunk:", error.message);
        }
      }
    }

    return file;
  } catch (error) {
    console.error("Error retrieving or reassembling file:", error.message);
  }
}

export async function mainretrieve(channelId, fileHash, BOT_TOKEN, fileSize) {
  const client = new Client({ intents });

  return new Promise((resolve, reject) => {
    client.once("ready", async () => {
      console.log("Bot is ready!");

      try {
        const channel = await client.channels.fetch(channelId);
        const file = await retrieveAndReassembleFile(
          channel,
          fileHash,
          fileSize
        );
        resolve(file);
      } catch (error) {
        console.error("Error retrieving file:", error.message);
        reject(error);
      } finally {
        client.destroy();
      }
    });

    client.login(BOT_TOKEN);
  });
}
