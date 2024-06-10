async function errorHandler(msgId, bot, error) {
  console.error(error.message);
  await bot.sendMessage(msgId, `
    Что-то пошло не так... Попробуйте повторить процесс позже.
  `);
}

module.exports = errorHandler;
