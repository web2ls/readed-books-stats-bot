async function addBook(bot, msg) {
  const authorNamePrompt = await bot.sendMessage(msg.chat.id, 'Введите имя автора', {
    reply_markup: {
      force_reply: true,
    }
  });

  bot.onReplyToMessage(msg.chat.id, authorNamePrompt.message_id, async (nameMsg) => {
    bot.clearReplyListeners();
    const bookNamePrompt = await bot.sendMessage(msg.chat.id, 'Введите наименование книги', {
      reply_markup: {
        force_reply: true,
      }
    });

    bot.onReplyToMessage(msg.chat.id, bookNamePrompt.message_id, async (bookNameMsg) => {
      const startDatePrompt = await bot.sendMessage(msg.chat.id, 'Введите дату старта', {
        reply_markup: {
          force_reply: true,
        }
      });

      bot.onReplyToMessage(msg.chat.id, startDatePrompt.message_id, async (startDateMsg) => {
        const endDatePrompt = await bot.sendMessage(msg.chat.id, 'Введите дату окончания', {
          reply_markup: {
            force_reply: true,
          }
        });

        bot.onReplyToMessage(msg.chat.id, endDatePrompt.message_id, async (endDateMsg) => {
          const pagesAmountPrompt = await bot.sendMessage(msg.chat.id, 'Введите количество страниц в книге', {
            reply_markup: {
              force_reply: true,
            }
          });

          bot.onReplyToMessage(msg.chat.id, pagesAmountPrompt.message_id, async (pagesAmountMsg) => {
            // console.log(nameMsg);
            const bookItem = {
              author: nameMsg.text,
              title: bookNameMsg.text,
              startedAt: startDateMsg.text,
              finishedAt: endDateMsg.text,
              pages: pagesAmountMsg.text,
            }
            console.log('book item is', bookItem);
            bot.clearReplyListeners();
            await bot.sendMessage(
              msg.chat.id,
              `Книга добавлена:
                Author: ${nameMsg.text}`
            );
          })
        })
      })
    })
  })
}

module.exports = addBook;