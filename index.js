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

bot.onText(/\/add/, addBook);

// bot.onText(/\/add/, async (msg) => {
  // const authorNamePrompt = await bot.sendMessage(msg.chat.id, 'Введите имя автора', {
  //   reply_markup: {
  //     force_reply: true,
  //   }
  // });
  // // console.log(authorNamePrompt);
  // bot.onReplyToMessage(msg.chat.id, authorNamePrompt.message_id, async (nameMsg) => {
  //   console.log('name message', nameMsg);
  //   const bookNamePrompt = await bot.sendMessage(msg.chat.id, 'Введите наименование книги', {
  //     reply_markup: {
  //       force_reply: true,
  //     }
  //   });
  // })
// })

bot.on("polling_error", err => console.log(err.data.error.message));