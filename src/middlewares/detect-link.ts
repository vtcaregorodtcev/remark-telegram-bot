import { Context } from 'telegraf';
import { Message } from 'telegraf/typings/core/types/typegram';
import { ExtContext, NextFunction } from 'typings';

export const detectLinkMiddleware = (ctx: Context & { message: { text: string } }, next: NextFunction): Promise<Message.TextMessage> | void => {
  if (!ctx.message.text.startsWith('🔖 ') && !ctx.message.text.startsWith('✏️ ')) { // skip check when we updating Bookmarks
    const regex = /(https?:\/\/[^\s]+)/g;

    const match = ctx.message.text.match(regex);

    if (!match || !match.length || !match[0]) {
      return ctx.reply('Sorry! Looks like it\'s not a Link.');
    }

    (ctx as ExtContext).session.Link = match[0];
  }

  next();
};