import fetch from 'node-fetch';
import { Context } from 'telegraf';
import { Message } from 'telegraf/typings/core/types/typegram';
import { ExtContext, NextFunction } from 'typings';
import { toArray } from 'utils/to-array';

export const editBookmarkMiddleware = async (ctx: Context & { message: { text: string } }, next: NextFunction): Promise<Message.TextMessage | void> => {
  if (!ctx.message.text.startsWith('✏️ ')) { // skip if it's not command starts with ✏️
    next();
  } else {
    const bookmark = (ctx as ExtContext).session.bookmark!;
    const { apiConfig = {} } = (ctx as ExtContext).session || {};

    const topLabels = toArray(bookmark.TopLabels);

    topLabels.pop();
    topLabels.unshift(bookmark.Label);

    try {
      const bmark = await (await fetch(`${apiConfig.apiPath}/bookmarks/${bookmark.Id}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...bookmark,
          TopLabels: topLabels.join(),
          IsRemarked: false,
        }),
        headers: {
          'accept': '*/*',
          'x-api-key': apiConfig.apiXKey!
        }
      })).json();

      (ctx as ExtContext).session.bookmark = bmark;
    } catch (e) {
      console.error(e);
      return ctx.reply('Sorry! Something went wrong...');
    }

    next();
  }
};