require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const addBook = require('./add-book');

const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, {polling: true});

const commands = [
  {
      command: "add",
      description: "Добавить книгу"
  },
]

bot.setMyCommands(commands);

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    await bot.sendMessage(chatId, 'Добро пожаловать в вашу мета-библиотеку!');
  } catch {
    console.log('Error due processing /start command');
  }
})

bot.onText(/\/add/, addBook.bind(this, bot));

bot.on("polling_error", err => console.log(err.data.error.message));