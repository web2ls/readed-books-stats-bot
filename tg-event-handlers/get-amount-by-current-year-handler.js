const errorHandler = require('./error-handler');
const BookController = require('../controllers/book-controller');

async function getAmountByCurrentYearHandler(bot, msg) {
  try {
    const booksAmount = await BookController.getBooksAmountByCurrentYear();

    await bot.sendMessage(msg.chat.id, `${ booksAmount.amount }`);
  } catch(error) {
    errorHandler(msg.chat.id, bot, error);
  }
}

module.exports = getAmountByCurrentYearHandler;
