const { getBookIdFromString } = require('../helpers');
const errorHandler = require('./error-handler');
const BookController = require('../controllers/book-controller');

async function editBookHandler(bot, msg) {
  try {
    const newValuePrompt = await bot.sendMessage(msg.chat.id, 'Новое значение:', {
      reply_markup: {
        force_reply: true,
      }
    });

    // TODO: move to menu-tg-controller
    bot.onReplyToMessage(msg.chat.id, newValuePrompt.message_id, async (newValueMsg) => {
      const bookId = getBookIdFromString(msg.text);
      await BookController.update(bookId, newValueMsg.text, msg.text);
      const bookItem = await BookController.getBookById(bookId);
      await bot.sendMessage(msg.chat.id, 'Книга обновлена');

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

      // TODO: check if will be cleared all listeners for all users
      bot.clearReplyListeners();
    });
  } catch(error) {
    errorHandler(msg.chat.id, bot, error);
  }
}

module.exports = editBookHandler;
