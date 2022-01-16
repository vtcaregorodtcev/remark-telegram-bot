import { Message } from 'telegraf/typings/core/types/typegram';
import { ContextWithMessage, ContextWithSession, NextFunction } from 'typings';

export const detectLinkMiddleware = (ctx: ContextWithMessage, next: NextFunction): Promise<Message.TextMessage> | void => {
  const regex = /(https?:\/\/[^\s]+)/g;

  const match = ctx.message.text.match(regex);

  if (!match || !match.length || !match[0]) {
    return ctx.reply('Sorry! Looks like it\'s not a Link.');
  }

  (ctx as ContextWithSession).session.set('Link', match[0]);

  next();
};