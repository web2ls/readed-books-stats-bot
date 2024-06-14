const errorHandler = require('./error-handler');
const BookController = require('../controllers/book-controller');
const { openEditableFieldsMenu } = require('./menu-handler');
const { getBookIdFromMessage } = require('../helpers');

async function editBookHandler(bot, msg) {
  try {
    const newValuePrompt = await bot.sendMessage(msg.chat.id, 'Новое значение:', {
      reply_markup: {
        force_reply: true,
      }
    });

    bot.onReplyToMessage(msg.chat.id, newValuePrompt.message_id, async (newValueMsg) => {
      const bookId = getBookIdFromMessage(msg.text);
      await BookController.update(bookId, newValueMsg.text, msg.text);
      const bookItem = await BookController.getBookById(bookId);
      await bot.sendMessage(msg.chat.id, 'Книга обновлена');

      await openEditableFieldsMenu(bot, msg.chat.id, bookItem);

      // TODO: check if will be cleared all listeners for all users
      bot.clearReplyListeners();
    });
  } catch(error) {
    errorHandler(msg.chat.id, bot, error);
  }
}

module.exports = editBookHandler;
