async function addBook(msg) {
  const authorNamePrompt = await bot.sendMessage(msg.chat.id, 'Введите имя автора', {
    reply_markup: {
      force_reply: true,
    }
  });

  bot.onReplyToMessage(msg.chat.id, authorNamePrompt.message_id, async (nameMsg) => {
    const bookNamePrompt = await bot.sendMessage(msg.chat.id, 'Введите наименование книги', {
      reply_markup: {
        force_reply: true,
      }
    });

    bot.onReplyToMessage(msg.chat.id, bookNamePrompt.message_id, async (bookNameMsg) => {
      const bookNamePrompt = await bot.sendMessage(msg.chat.id, 'Введите наименование книги', {
        reply_markup: {
          force_reply: true,
        }
      });
    })
  })
}

module.exports = addBook;