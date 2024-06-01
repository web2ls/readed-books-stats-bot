const { getValidatedDate, getValidatedPagesAmount, getValidatedRating, getValidatedText } = require('../helpers');
const addBookController = require('../controllers/add-book-controller');

async function addBookTgController(bot, msg) {
  try {
    await bot.sendMessage(msg.chat.id, `
      Необходимо заполнить информацию о книге. В те поля, которые вы пропускаете ставьте прочерк '-'. В случае ошибочного заполнения - будет сохранено значение по-умолчанию. Исправить ошибку можно будет при редактировании информации.
    `)
    const authorNamePrompt = await bot.sendMessage(msg.chat.id, 'Имя автора', {
      reply_markup: {
        force_reply: true,
      }
    });

    bot.onReplyToMessage(msg.chat.id, authorNamePrompt.message_id, async (nameMsg) => {
      bot.clearReplyListeners();
      const bookNamePrompt = await bot.sendMessage(msg.chat.id, 'Наименование книги', {
        reply_markup: {
          force_reply: true,
        }
      });

      bot.onReplyToMessage(msg.chat.id, bookNamePrompt.message_id, async (bookNameMsg) => {
        const startDatePrompt = await bot.sendMessage(msg.chat.id, 'Когда начали читать (в формате 01-01-2020)', {
          reply_markup: {
            force_reply: true,
          }
        });

        bot.onReplyToMessage(msg.chat.id, startDatePrompt.message_id, async (startDateMsg) => {
          const endDatePrompt = await bot.sendMessage(msg.chat.id, 'Когда закончили читать (в формате 01-01-2020)', {
            reply_markup: {
              force_reply: true,
            }
          });

          bot.onReplyToMessage(msg.chat.id, endDatePrompt.message_id, async (endDateMsg) => {
            const pagesAmountPrompt = await bot.sendMessage(msg.chat.id, 'Количество страниц', {
              reply_markup: {
                force_reply: true,
              }
            });

            bot.onReplyToMessage(msg.chat.id, pagesAmountPrompt.message_id, async (pagesAmountMsg) => {
              const ratingPrompt = await bot.sendMessage(msg.chat.id, 'Введите рейтинг книги (по шкале от 1 до 5 включительно)', {
                reply_markup: {
                  force_reply: true,
                }
              });

              bot.onReplyToMessage(msg.chat.id, ratingPrompt.message_id, async (ratingMsg) => {
                const reviewPrompt = await bot.sendMessage(msg.chat.id, 'Напишите ваш отзыв на книгу', {
                  reply_markup: {
                    force_reply: true,
                  }
                });

                bot.onReplyToMessage(msg.chat.id, reviewPrompt.message_id, async (reviewMsg) => {
                  const newBook = {
                    userId: msg.from.id,
                    author: getValidatedText(nameMsg.text),
                    title: getValidatedText(bookNameMsg.text),
                    startedAt: getValidatedDate(startDateMsg.text),
                    finishedAt: getValidatedDate(endDateMsg.text),
                    pagesAmount: getValidatedPagesAmount(pagesAmountMsg.text),
                    rating: getValidatedRating(ratingMsg.text),
                    review: getValidatedText(reviewMsg.text),
                  }
                  console.log('book item is', newBook);
                  bot.clearReplyListeners();
                  await addBookController(newBook);
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
    await bot.sendMessage(msg.chat.id, `
      Что-то пошло не так... Попробуйте повторить процесс позже.
    `);
  }
}

module.exports = addBookTgController;