const errorHandler = require('./error-handler');
const BookController = require('../controllers/book-controller');
const { getBookIdFromMessage } = require('../helpers');

async function deleteBookHandler(bot, msg) {
  try {
    const bookId = getBookIdFromMessage(msg.text);

    if (!bookId) {
      await errorHandler(msg.chat.id, bot, { message: 'Failed to get bookId' });
      return;
    }

    await BookController.deleteBook(bookId);

    await bot.sendMessage(msg.chat.id, 'Книга удалена', {
      reply_markup: {
        remove_keyboard: true,
      }
    });
  } catch(error) {
    errorHandler(msg.chat.id, bot, error);
  }
}

module.exports = deleteBookHandler;