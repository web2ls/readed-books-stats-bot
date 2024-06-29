const errorHandler = require('./error-handler');
const BookController = require('../controllers/book-controller');

async function getBooksListByCurrentMonthHandler(bot, msg) {
  try {
    const books = await BookController.getBooksListByCurrentMonth(msg.from.id);

    await bot.sendMessage(msg.chat.id, books);
  } catch(error) {
    errorHandler(msg.chat.id, bot, error);
  }
}

module.exports = getBooksListByCurrentMonthHandler;