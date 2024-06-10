const BookController = require('../controllers/book-controller');
const errorHandler = require('../tg-event-handlers/error-handler');

async function editBookFieldTGController(bot, msg) {
  try {
    await bot.sendMessage(msg.chat.id, `
      Поиск будет осуществляться по имени автора и наименованию книги. Будут выведены 5 подходящих вариантов.
  `);

    const searchQueryPrompt = await bot.sendMessage(msg.chat.id, 'Поисковый запрос:', {
      reply_markup: {
        force_reply: true,
      }
    });

    bot.onReplyToMessage(msg.chat.id, searchQueryPrompt.message_id, async (searchQueryMsg) => {
      const searchedBooks = await BookController.searchBook(searchQueryMsg.text);

      if (searchedBooks.length === 0) {
        await bot.sendMessage(msg.chat.id, `Книг не найдено`);
        return;
      }

      await bot.sendMessage(msg.chat.id, `Найденные книги`, {
        reply_markup: {
          keyboard: searchedBooks,
        }
      })
    })
  } catch(error) {
    await errorHandler(msg.chat.id, bot, error);
  }
}

module.exports = searchBookTGController;