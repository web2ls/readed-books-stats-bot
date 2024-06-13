const BookController = require('../controllers/book-controller');
const errorHandler = require('./error-handler');
const { openEditableFieldsMenu } = require('./menu-handler');
const { getBookIdFromMessage } = require('../helpers');

async function selectBookForEditHandler(bot, msg) {
  try {
    const bookId = getBookIdFromMessage(msg.text);

    // TODO: make Error helper with message about error
    // if (!bookId) {error}

    const bookItem = await BookController.getBookById(bookId);

    if (!bookItem) {
      return;
    }

    // TODO: if (!bookItem) {error}

    await openEditableFieldsMenu(bot, msg.chat.id, bookItem);
  } catch(error) {
    errorHandler(msg.chat.id, bot, error);
  }
}

module.exports = selectBookForEditHandler;
