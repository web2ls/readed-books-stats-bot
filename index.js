require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();

const db = require('./db');
const COMMANDS = require('./commands');
const addBookTGController = require('./tg-controllers/add-book-tg-controller');
const searchBookTGController = require('./tg-controllers/search-book-tg-controller');
const BookController = require('./controllers/book-controller');
const MenuTgController = require('./tg-controllers/menu-tg-controller');
const { getBookIdFromString } = require('./helpers');
const editBookHandler = require('./tg-event-handlers/edit-book-handler');

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

const PORT = process.env.PORT;
const TOKEN = process.env.BOT_TOKEN;

const bot = new TelegramBot(TOKEN, {polling: true});

bot.setMyCommands(COMMANDS);

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    await bot.sendMessage(chatId, 'Добро пожаловать в вашу мета-библиотеку!');
  } catch {
    console.log('Error due processing /start command');
  }
})

bot.onText(/\/add/, addBookTGController.bind(this, bot));

bot.onText(/\/find/, searchBookTGController.bind(this, bot));

bot.onText(/stats/, async (msg) => {
  await bot.sendMessage(msg.chat.id, 'Выберите период', {
    reply_markup: {
      keyboard: [
        ['Прочитано за месяц', 'Прочитано за год'],
        ['Закрыть меню'],
    ],
    resize_keyboard: true,
    }
  });
});

bot.onText(/Прочитано за месяц/, async (msg) => {
  const query = `
    SELECT title FROM books WHERE finished_at = 1728158400000
  `

  db.all(query, (error, rows) => {
    if (error) {
      console.log('Failed to get books on current month', error.message);
    } else {
      console.log('Books on this month finded');
      console.log(rows);
    }
  })
});

bot.onText(/^(Автор|Наименование|Начали|Закончили|Страницы|Рейтинг|Обзор).*\[[0-9]*\]$/, editBookHandler.bind(this, bot));

bot.onText(/^(?!Автор|Наименование|Начали|Закончили|Страницы|Рейтинг|Обзор).*\[[\0-9]*\]$/, async (msg) => {
  console.log(msg.text);
  console.log(msg);
  const bookId = getBookIdFromString(msg.text);
  console.log(bookId);

  // TODO: make Error helper with message about error
  // if (!bookId) {error}

  const bookItem = await BookController.getBookById(bookId);

  if (!bookItem) {
    return;
  }

  // TODO: if (!bookItem) {error}

  // Автор|Наименование|Начали|Закончили|Страниц|Рейтинг|Обзор
  await bot.sendMessage(msg.chat.id, 'Выберите, что вы хотите отредактировать', {
    reply_markup: {
        keyboard: [
            [`Автор: ${bookItem.author} [${bookItem.id}]`],
            [`Наименование: ${bookItem.title} [${bookItem.id}]`],
            [`Начали: ${bookItem.started_at !== 'null' ? new Intl.DateTimeFormat('ru-RU').format(bookItem.started_at) : '-'} [${bookItem.id}]`],
            [`Закончили: ${bookItem.finished_at !== 'null' ? new Intl.DateTimeFormat('ru-RU').format(bookItem.finished_at) : '-'} [${bookItem.id}]`],
            [`Страницы: ${bookItem.pages_amount} [${bookItem.id}]`, `Рейтинг: ${bookItem.rating} [${bookItem.id}]`],
            [`Обзор: ${bookItem.review} [${bookItem.id}]`],
            ['Закрыть меню'],
        ],
        resize_keyboard: true,
    }
  })
});

bot.onText(/^Закрыть меню$/, MenuTgController.closeMenu.bind(this, bot));

bot.on("polling_error", err => console.log(err.data.error.message));

app.listen(PORT, () => {
  console.log('Server has been started...');
})