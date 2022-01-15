import fetch from 'node-fetch';
import { Context } from 'telegraf';
import { Message } from 'telegraf/typings/core/types/typegram';
import { ExtContext, NextFunction } from 'typings';

export const remarkLinkMiddleware = async (ctx: Context & { message: { text: string } }, next: NextFunction): Promise<Message.TextMessage | void> => {
  if (!ctx.message.text.startsWith('🔖 ')) { // skip if it's not command starts with 🔖
    next();
  } else {
    const Label = ctx.message.text.split('🔖 ')[1];
    const bookmark = (ctx as ExtContext).session.bookmark;
    const { apiConfig = {} } = (ctx as ExtContext).session || {};

    if (!bookmark) {
      return ctx.reply('Sorry! You need to provide some Link before!');
    }

    try {
      await (await fetch(`${apiConfig.apiPath}/bookmarks/${bookmark.Id}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...bookmark,
          Label,
          IsRemarked: true,
        }),
        headers: {
          'accept': '*/*',
          'x-api-key': apiConfig.apiXKey!
        }
      })).json();

      (ctx as ExtContext).session = {
        ...(ctx as ExtContext).session,
        Link: undefined,
        Text: undefined,
        bookmark: undefined
      };
    } catch (e) {
      console.error(e);
      return ctx.reply('Sorry! Something went wrong...');
    }

    return ctx.reply(`You have successfully remarked [${bookmark.Link}] as ${Label}!`);
  }
};