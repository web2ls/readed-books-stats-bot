require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();
const cors = require('cors');
const pino = require('pino-http')();

const db = require('./db');
const COMMANDS = require('./commands');
const addBookHandler = require('./tg-event-handlers/add-book-handler');
const searchBookHandler = require('./tg-event-handlers/search-book-handler');
const editBookHandler = require('./tg-event-handlers/edit-book-handler');
const selectBookForEditHandler = require('./tg-event-handlers/select-book-for-edit-handler');
const getAmountByCurrentMonthHandler = require('./tg-event-handlers/get-amount-by-current-month-handler');
const getAmountByCurrentYearHandler = require('./tg-event-handlers/get-amount-by-current-year-handler');
const deleteBookHandler = require('./tg-event-handlers/delete-book-handler');
const getBooksListByCurrentMonthHandler = require('./tg-event-handlers/get-books-list-by-current-month-handler');
const { closeMenu, openQuickStatsMenu } = require('./tg-event-handlers/menu-handler');

const { addBook, editBook, deleteBook, getBook, searchBook, getBooksByCurrentMonth, getBooksByCurrentYear } = require('./api');

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
bot.setMyCommands(COMMANDS);

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

bot.onText(/\/add/, addBookHandler.bind(this, bot));

bot.onText(/\/find/, searchBookHandler.bind(this, bot));

bot.onText(/\/quickstats/, openQuickStatsMenu.bind(this, bot));

bot.onText(/^Количество за месяц$/, getAmountByCurrentMonthHandler.bind(this, bot));

bot.onText(/^Количество за год$/, getAmountByCurrentYearHandler.bind(this, bot));

bot.onText(/^Список книг за месяц$/, getBooksListByCurrentMonthHandler.bind(this, bot));

bot.onText(/^(Автор|Наименование|Начали|Закончили|Страницы|Рейтинг|Обзор).*\[[0-9]*\]$/, editBookHandler.bind(this, bot));

bot.onText(/^(?!Автор|Наименование|Начали|Закончили|Страницы|Рейтинг|Обзор).*\[[\0-9]*\]$/, selectBookForEditHandler.bind(this, bot));

bot.onText(/^Удалить книгу .*/, deleteBookHandler.bind(this, bot));

bot.onText(/^Закрыть меню$/, closeMenu.bind(this, bot));

bot.on("polling_error", err => console.log(err.data.error.message));

app.get('/api/books/search', searchBook);
app.get('/api/books/by-month/:userId', getBooksByCurrentMonth);
app.get('/api/books/by-year/:userId', getBooksByCurrentYear);
app.get('/api/books/:id', getBook);
app.post('/api/books/add', addBook);
app.post('/api/books/edit', editBook);
app.delete('/api/books/:id', deleteBook);

app.listen(PORT, () => {
  console.log('Server has been started...');
})