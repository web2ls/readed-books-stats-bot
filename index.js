require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const db = require('./db');
const COMMANDS = require('./commands');
const addBookHandler = require('./tg-event-handlers/add-book-handler');
const searchBookHandler = require('./tg-event-handlers/search-book-handler');
const editBookHandler = require('./tg-event-handlers/edit-book-handler');
const selectBookForEditHandler = require('./tg-event-handlers/select-book-for-edit-handler');
const { closeMenu } = require('./tg-event-handlers/menu-handler');

const createTableBooksQuery = `
  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    author VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    started_at VARCHAR(255),
    finished_at VARCHAR(255),
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

bot.onText(/\/add/, addBookHandler.bind(this, bot));

bot.onText(/\/find/, searchBookHandler.bind(this, bot));

bot.onText(/quickstats/, async (msg) => {
  await bot.sendMessage(msg.chat.id, 'Выберите период', {
    reply_markup: {
      keyboard: [
        ['Количество за месяц', 'Количество за год'],
        ['Закрыть меню'],
    ],
    resize_keyboard: true,
    }
  });
});

bot.onText(/Количество за месяц/, async (msg) => {

  const query = `
    SELECT * FROM books;
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

bot.onText(/^(?!Автор|Наименование|Начали|Закончили|Страницы|Рейтинг|Обзор).*\[[\0-9]*\]$/, selectBookForEditHandler.bind(this, bot));

bot.onText(/^Закрыть меню$/, closeMenu.bind(this, bot));

bot.on("polling_error", err => console.log(err.data.error.message));