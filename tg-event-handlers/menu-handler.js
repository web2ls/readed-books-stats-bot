async function closeMenu(bot, msg) {
  await bot.sendMessage(msg.chat.id, 'Меню закрыто', {
    reply_markup: {
      remove_keyboard: true,
    }
  });
};

async function openEditableFieldsMenu(bot, msgId, bookItem) {
  await bot.sendMessage(msgId, 'Выберите, что вы хотите отредактировать', {
    reply_markup: {
        keyboard: [
            [`Автор: ${bookItem.author} [${bookItem.id}]`],
            [`Наименование: ${bookItem.title} [${bookItem.id}]`],
            [`Начали: ${bookItem.started_at !== 'null' ? new Date(bookItem.started_at).toLocaleDateString('ru') : '-'} [${bookItem.id}]`],
            [`Закончили: ${bookItem.finished_at !== 'null' ? new Date(bookItem.finished_at).toLocaleDateString('ru') : '-'} [${bookItem.id}]`],
            [`Страницы: ${bookItem.pages_amount} [${bookItem.id}]`, `Рейтинг: ${bookItem.rating} [${bookItem.id}]`],
            [`Обзор: ${bookItem.review} [${bookItem.id}]`],
            ['Закрыть меню'],
        ],
        resize_keyboard: true,
    }
  })
};

module.exports = {
  closeMenu,
  openEditableFieldsMenu,
};
