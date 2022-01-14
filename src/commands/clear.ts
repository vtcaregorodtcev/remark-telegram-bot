import { Context } from 'telegraf';
import { Message } from 'telegraf/typings/core/types/typegram';
import { ExtContext } from 'typings';

export const clearCommand = (ctx: Context): Promise<Message.TextMessage> => {
  (ctx as ExtContext).session.apiConfig = {};

  return ctx.reply('You have cleared API config.');
};