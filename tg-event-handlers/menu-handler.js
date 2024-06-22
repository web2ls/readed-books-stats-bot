const { convertDateToUserFormat } = require('../helpers');

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
            [`Начали: ${convertDateToUserFormat(bookItem.started_at)} [${bookItem.id}]`],
            [`Закончили: ${convertDateToUserFormat(bookItem.finished_at)} [${bookItem.id}]`],
            [`Страницы: ${bookItem.pages_amount} [${bookItem.id}]`, `Рейтинг: ${bookItem.rating} [${bookItem.id}]`],
            [`Обзор: ${bookItem.review} [${bookItem.id}]`],
            ['Закрыть меню'],
        ],
        resize_keyboard: true,
    }
  })
};

async function openQuickStatsMenu(bot, msg) {
  await bot.sendMessage(msg.chat.id, 'Выберите период', {
    reply_markup: {
      keyboard: [
        ['Количество за месяц', 'Количество за год'],
        ['Закрыть меню'],
    ],
    resize_keyboard: true,
    }
  });
}

module.exports = {
  closeMenu,
  openEditableFieldsMenu,
  openQuickStatsMenu,
};
