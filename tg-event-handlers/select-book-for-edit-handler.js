const BookController = require('../controllers/book-controller');
const errorHandler = require('./error-handler');
const { openEditableFieldsMenu } = require('./menu-handler');
const { getBookIdFromMessage } = require('../helpers');

async function selectBookForEditHandler(bot, msg) {
  console.log('selectBookForEditHandler');
  try {
    const bookId = getBookIdFromMessage(msg.text);

    if (!bookId) {
      await errorHandler(msg.chat.id, bot, { message: 'Failed to get bookId' });
      return;
    }

    const bookItem = await BookController.getBookById(bookId);

    if (!bookItem) {
      await errorHandler(msg.chat.id, bot, { message: 'Failed to get bookItem' });
      return;
    }

    await openEditableFieldsMenu(bot, msg.chat.id, bookItem);
  } catch(error) {
    errorHandler(msg.chat.id, bot, error);
  }
}

module.exports = selectBookForEditHandler;
