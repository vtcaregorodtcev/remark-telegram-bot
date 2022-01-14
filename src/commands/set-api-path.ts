import { Context } from 'telegraf';
import { Message } from 'telegraf/typings/core/types/typegram';
import { ExtContext } from 'typings';

export const setApiPathCommand = (ctx: Context & { message: { text: string } }): Promise<Message.TextMessage> => {
  const apiPath = ctx.message.text.split(' ')[1];

  if (!apiPath) {
    return ctx.reply('Invalid use of command.\n\nUse [ /apiPath path_to_backend ] syntax');
  }

  const { apiConfig = {} } = (ctx as ExtContext).session || {};
  (ctx as ExtContext).session.apiConfig = { ...apiConfig, apiPath };

  return ctx.reply(`You have set API path: ${apiPath}`);
};