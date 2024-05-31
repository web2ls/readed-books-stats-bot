require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();

const db = require('./db');

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT NOT NULL
  )
`;

db.serialize(() => {
  db.run(createTableQuery, (error) => {
    if (error) {
      console.log('Error on creating table ', error.message);
    } else {
      console.log('Table created successfully');
    }
  })
});

const insertUserQuery = `
  INSERT INTO users (username, email) VALUES ('skif', 'skif@mail.com')
`;

db.run(insertUserQuery, (error) => {
  if (error) {
    console.log('Failed inset into table');
  } else {
    console.log('Row created');
  }
})

const selectQuery = `
  SELECT * FROM users
`;

db.all(selectQuery, (err, rows) => {
  if (err) {
    console.error('Error fetching data:', err.message);
  } else {
    console.log('Fetched data:', rows);
  }
});

const PORT = process.env.PORT;

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

app.listen(PORT, () => {
  console.log('Server has been started...');
})