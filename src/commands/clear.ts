import { Message } from 'telegraf/typings/core/types/typegram';
import { ContextWithMessage, ContextWithSession } from 'typings';

export const clearCommand = (ctx: ContextWithMessage): Promise<Message.TextMessage> => {
  (ctx as ContextWithSession).session.set('apiConfig', {});

  return ctx.reply('You have cleared API config.');
};