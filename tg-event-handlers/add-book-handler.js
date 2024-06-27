const BookController = require('../controllers/book-controller');
const errorHandler = require('./error-handler');

async function addBookHandler(bot, msg) {
  try {
    await bot.sendMessage(msg.chat.id, `
      Необходимо заполнить информацию о книге. В те поля, которые вы пропускаете ставьте прочерк '-'. В случае ошибочного заполнения - будет сохранено значение по-умолчанию. Исправить ошибку можно будет при редактировании информации.
    `)
    const authorNamePrompt = await bot.sendMessage(msg.chat.id, 'Имя автора', {
      reply_markup: {
        force_reply: true,
      }
    });

    const authorNamePromptListener = bot.onReplyToMessage(msg.chat.id, authorNamePrompt.message_id, async (nameMsg) => {
      const bookNamePrompt = await bot.sendMessage(msg.chat.id, 'Наименование книги', {
        reply_markup: {
          force_reply: true,
        }
      });

      bot.removeReplyListener(authorNamePromptListener);

      const bookNamePromptListener = bot.onReplyToMessage(msg.chat.id, bookNamePrompt.message_id, async (bookNameMsg) => {
        const startDatePrompt = await bot.sendMessage(msg.chat.id, 'Когда начали читать (в формате 5.10.2020)', {
          reply_markup: {
            force_reply: true,
          }
        });

        bot.removeReplyListener(bookNamePromptListener);

        const startDatePromptListener = bot.onReplyToMessage(msg.chat.id, startDatePrompt.message_id, async (startDateMsg) => {
          const endDatePrompt = await bot.sendMessage(msg.chat.id, 'Когда закончили читать (в формате 5.10.2020)', {
            reply_markup: {
              force_reply: true,
            }
          });

          bot.removeReplyListener(startDatePromptListener);

          const endDatePromptListener = bot.onReplyToMessage(msg.chat.id, endDatePrompt.message_id, async (endDateMsg) => {
            const pagesAmountPrompt = await bot.sendMessage(msg.chat.id, 'Количество страниц', {
              reply_markup: {
                force_reply: true,
              }
            });

            bot.removeReplyListener(endDatePromptListener);

            const pagesAmountPromptListener = bot.onReplyToMessage(msg.chat.id, pagesAmountPrompt.message_id, async (pagesAmountMsg) => {
              const ratingPrompt = await bot.sendMessage(msg.chat.id, 'Введите рейтинг книги (по шкале от 1 до 5 включительно)', {
                reply_markup: {
                  force_reply: true,
                }
              });

              bot.removeReplyListener(pagesAmountPromptListener);

              const ratingPromptListener = bot.onReplyToMessage(msg.chat.id, ratingPrompt.message_id, async (ratingMsg) => {
                const reviewPrompt = await bot.sendMessage(msg.chat.id, 'Напишите ваш отзыв на книгу', {
                  reply_markup: {
                    force_reply: true,
                  }
                });

                bot.removeReplyListener(ratingPromptListener);

                const reviewPromptListener = bot.onReplyToMessage(msg.chat.id, reviewPrompt.message_id, async (reviewMsg) => {
                  const newBook = {
                    userId: msg.from.id,
                    author: nameMsg.text,
                    title: bookNameMsg.text,
                    startedAt: startDateMsg.text,
                    finishedAt: endDateMsg.text,
                    pagesAmount: pagesAmountMsg.text,
                    rating: ratingMsg.text,
                    review: reviewMsg.text,
                  }

                  bot.removeReplyListener(reviewPromptListener);

                  await BookController.addBook(newBook);
                  await bot.sendMessage(
                    msg.chat.id,
                    `Книга добавлена`
                  );
                })
              })
            })
          })
        })
      })
    })
  } catch {
    await errorHandler(msg.chat.id, bot, { message: 'Failed to add book' });
  }
}

module.exports = addBookHandler;