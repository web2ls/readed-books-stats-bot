const findBookController = require('../controllers/find-book-controller');

async function findBookTGController(bot, msg) {
  console.log('find book');
  await bot.sendMessage(msg.chat.id, `
    Поиск будет осуществляться по имени автора и наименованию книги. Будут выведены 5 подходящих вариантов.
`);

  const searchQueryPrompt = await bot.sendMessage(msg.chat.id, 'Поисковый запрос:', {
    reply_markup: {
      force_reply: true,
    }
  });

  bot.onReplyToMessage(msg.chat.id, searchQueryPrompt.message_id, async (searchQueryMsg) => {
    console.log(searchQueryMsg.text);
    await findBookController(searchQueryMsg.text);
  })
}

module.exports = findBookTGController;