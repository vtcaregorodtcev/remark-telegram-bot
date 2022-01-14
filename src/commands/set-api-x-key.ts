import { Context } from 'telegraf';
import { Message } from 'telegraf/typings/core/types/typegram';
import { ExtContext } from 'typings';

export const setApiXKeyCommand = (ctx: Context & { message: { text: string } }): Promise<Message.TextMessage> => {
  const apiXKey = ctx.message.text.split(' ')[1];

  if (!apiXKey) {
    return ctx.reply('Invalid use of command.\n\nUse [ /apiXKey api_key ] syntax');
  }

  const { apiConfig = {} } = (ctx as ExtContext).session || {};
  (ctx as ExtContext).session.apiConfig = { ...apiConfig, apiXKey };

  return ctx.reply(`You have set API X-Key: ${apiXKey}`);
};