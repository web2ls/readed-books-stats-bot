const path = require('path');

require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();
const cors = require('cors');
const pino = require('pino-http')();

const db = require('./db');

const { addBook, editBook, deleteBook, getBook, searchBook, getQuickStats } = require('./api');

const createTableBooksQuery = `
  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    author VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
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

const PORT = process.env.API_PORT;
const TOKEN = process.env.BOT_TOKEN;
const bot = new TelegramBot(TOKEN, {polling: true});

app.use(express.static('dist'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(pino);

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    await bot.sendMessage(chatId, 'Добро пожаловать в вашу мета-библиотеку!');
  } catch {
    console.log('Error due processing /start command');
  }
})

bot.on("polling_error", err => console.log(err.data.error.message));

app.get('/api/books/search', searchBook);
app.get('/api/books/:id', getBook);
app.get('/api/users/quick-stats/:id', getQuickStats);
app.post('/api/books/add', addBook);
app.post('/api/books/edit', editBook);
app.delete('/api/books/:id', deleteBook);

app.get('*', (_, response) => {
  response.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log('Server has been started...');
})