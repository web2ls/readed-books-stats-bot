async function errorHandler(msgId, bot) {
  await bot.sendMessage(msgId, `
    Что-то пошло не так... Попробуйте повторить процесс позже.
  `, {
    reply_markup: {
      remove_keyboard: true,
    }
  });
}

module.exports = errorHandler;
