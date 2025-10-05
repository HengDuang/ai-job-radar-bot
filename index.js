import TelegramBot from "node-telegram-bot-api";
import fetch from "node-fetch";

const TOKEN = process.env.BOT_TOKEN;
const bot = new TelegramBot(TOKEN, { polling: true });

console.log("🤖 Bot is running...");

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, `👋 Welcome to AI Job Radar!
I can send you the latest AI & Remote job openings.

Use one of these:
🧠 /ai — AI + ML Jobs
💻 /remote — Remote Tech Jobs`);
});

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
