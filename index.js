import TelegramBot from "node-telegram-bot-api";
import fetch from "node-fetch";
import { XMLParser } from "fast-xml-parser";

const TOKEN = process.env.BOT_TOKEN;
const bot = new TelegramBot(TOKEN, { polling: true });

console.log("🤖 Bot is running...");

// Start command
bot.onText(/\/start/, (msg) => {
  const text = `👋 Welcome to AI Job Radar 🇸🇬
I can send you the latest job openings.

Use one of these:
🧠 /ai — AI & Tech Jobs (RemoteOK)
🇸🇬 /sg — Singapore Jobs (MyCareersFuture)
💻 /remote — Global Remote Jobs`;
  bot.sendMessage(msg.chat.id, text);
});

// 🇸🇬 Fetch Singapore jobs (MyCareersFuture feed)
bot.onText(/\/ai/, async (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "🧠 Fetching latest AI jobs...");

  try {
    const res = await fetch("https://remoteok.com/api");
    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (jsonErr) {
      console.error("⚠️ RemoteOK returned non-JSON:", text.slice(0, 200));
      throw new Error("RemoteOK API not returning JSON.");
    }

    const jobs = data.slice(1, 5);
    let textOut = "🧠 *Latest AI Jobs:*\n\n";

    jobs.forEach((j) => {
      if (j.position && j.company)
        textOut += `💼 *${j.position}* — ${j.company}\n🌐 [Apply Here](${j.url})\n\n`;
    });

    bot.sendMessage(chatId, textOut, { parse_mode: "Markdown" });
  } catch (err) {
    console.error("❌ Error fetching AI jobs:", err);
    bot.sendMessage(chatId, "❌ Sorry, I couldn’t fetch jobs right now. Try again later.");
  }
});


// Keep your existing /ai and /remote commands
bot.onText(/\/ai/, async (msg) => {
  const chatId = msg.chat.id;
  const res = await fetch("https://remoteok.com/api");
  const data = await res.json();
  const jobs = data.slice(1, 5);
  let text = "🧠 *Latest AI Jobs:*\n\n";
  jobs.forEach((j) => {
    if (j.position && j.company)
      text += `💼 *${j.position}* — ${j.company}\n🌐 [Apply Here](${j.url})\n\n`;
  });
  bot.sendMessage(chatId, text, { parse_mode: "Markdown" });
});
