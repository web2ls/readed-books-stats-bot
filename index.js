require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();

const db = require('./db');
const addBookTgController = require('./tg-controllers/add-book-tg-controller');

const createTableBooksQuery = `
  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    author TEXT NOT NULL,
    title TEXT NOT NULL,
    started_at INTEGER,
    finished_at INTEGER,
    pages_amount INTEGER NOT NULL,
    rating INTEGER NOT NULL,
    review TEXT NOT NULL
  )
`;

db.serialize(() => {
  db.run(createTableBooksQuery, (error) => {
    if (error) {
      console.log('Error on creating table ', error.message);
    } else {
      console.log('Initial tables created successfully');
    }
  })
});

db.all('SELECT * FROM books', (err, rows) => {
  if (err) {
    console.error('Error fetching data:', err.message);
  } else {
    console.log('Fetched data:', rows);
  }
});

const PORT = process.env.PORT;
const TOKEN = process.env.BOT_TOKEN;

const bot = new TelegramBot(TOKEN, {polling: true});

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

bot.onText(/\/add/, addBookTgController.bind(this, bot));

bot.on("polling_error", err => console.log(err.data.error.message));

app.listen(PORT, () => {
  console.log('Server has been started...');
})