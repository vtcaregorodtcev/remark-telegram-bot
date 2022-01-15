import { Context } from 'telegraf';
import { Message } from 'telegraf/typings/core/types/typegram';
import { ExtContext, NextFunction, Bookmark } from 'typings';
import fetch from 'node-fetch';

export const createBookmarkMiddleware = async (ctx: Context, next: NextFunction): Promise<Message.TextMessage | void> => {
  const url = (ctx as ExtContext).session.Link;

  if (!url) {
    (ctx as ExtContext).session.Link = '';
    return ctx.reply('Please, provide an URL to create a new Bookmark!');
  }

  const { apiConfig, Text } = (ctx as ExtContext).session;

  try {
    // @ts-ignore
    const bookmark: Bookmark = await (await fetch(`${apiConfig.apiPath!}/bookmarks`, {
      method: 'POST',
      body: JSON.stringify({
        Text,
        Link: url,
        Name: url
      }),
      headers: {
        'accept': '*/*',
        // @ts-ignore
        'x-api-key': apiConfig.apiXKey!
      }
    })).json();

    (ctx as ExtContext).session.bookmark = bookmark;
  } catch (e) {
    console.error(e);
    return ctx.reply('Sorry! Something went wrong...');
  }

  next();
};
