import { Message } from 'telegraf/typings/core/types/typegram';
import { NextFunction, ContextWithMessage, ContextWithSession } from 'typings';

export const apiConfigMiddleware = async (ctx: ContextWithMessage, next: NextFunction): Promise<Message.TextMessage | void> => {
  const config = await (ctx as ContextWithSession).session.get('apiConfig') || {};

  if (!config.apiPath) {
    return ctx.reply(`
      You din't set up your API Path⁉️ \n\nUse [ /apiPath path_to_backend ] command.
    `);
  }

  if (!config.apiXKey) {
    return ctx.reply(`
      You din't set up your API X-Key⁉️\n\nUse [ /apiXKey api_key ] command.
    `);
  }

  next();
};