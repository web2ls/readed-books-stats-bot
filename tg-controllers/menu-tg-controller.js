const MenuTgController = {
  closeMenu: async (bot, msg) => {
    await bot.sendMessage(msg.chat.id, 'Меню закрыто', {
      reply_markup: {
        remove_keyboard: true,
      }
    });
  },
}

module.exports = MenuTgController;
