import { Context } from 'telegraf';
import { Message } from 'telegraf/typings/core/types/typegram';
import { ContextWithSession, NextFunction, Bookmark } from 'typings';
import fetch from 'node-fetch';

export const createBookmarkMiddleware = async (ctx: Context, next: NextFunction): Promise<Message.TextMessage | void> => {
  const session = (ctx as ContextWithSession).session;

  const url = await session.get('Link');

  if (!url) {
    session.set('Link', '');
    return ctx.reply('Please, provide an URL to create a new Bookmark!');
  }

  const { apiConfig, Text } = await session.load();

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

    session.set('bookmark', bookmark);
  } catch (e) {
    console.error(e);
    return ctx.reply('Sorry! Something went wrong...');
  }

  next();
};
