import { Context } from 'telegraf';
import { Message } from 'telegraf/typings/core/types/typegram';
import { NextFunction, ExtContext } from 'typings';

export const apiConfigMiddleware = (ctx: Context, next: NextFunction): Promise<Message.TextMessage> | void => {
  if (!(ctx as ExtContext).session?.apiConfig?.apiPath) {
    return ctx.reply(`
      You din't set up your API Path⁉️ \n\nUse [ /apiPath path_to_backend ] command.
    `);
  }

  if (!(ctx as ExtContext).session?.apiConfig?.apiXKey) {
    return ctx.reply(`
      You din't set up your API X-Key⁉️\n\nUse [ /apiXKey api_key ] command.
    `);
  }

  next();
};