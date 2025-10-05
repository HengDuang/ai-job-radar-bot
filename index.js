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
bot.onText(/\/sg/, async (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "🔎 Fetching latest Singapore jobs...");

  try {
    const rssUrl = "https://www.mycareersfuture.gov.sg/feed";
    const res = await fetch(rssUrl);
    const xml = await res.text();

    const parser = new XMLParser();
    const data = parser.parse(xml);

    const items = data.rss.channel.item.slice(0, 5); // top 5 jobs

    let text = "🇸🇬 *Latest Jobs from MyCareersFuture:*\n\n";
    items.forEach((item) => {
      text += `💼 *${item.title}*\n🏢 ${item["dc:creator"] || "Company not listed"}\n🔗 [Apply Here](${item.link})\n\n`;
    });

    bot.sendMessage(chatId, text, { parse_mode: "Markdown" });
  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, "❌ Error fetching Singapore jobs.");
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
