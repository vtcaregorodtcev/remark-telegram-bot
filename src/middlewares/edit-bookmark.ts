import fetch from 'node-fetch';
import { Message } from 'telegraf/typings/core/types/typegram';
import { ContextWithMessage, ContextWithSession, NextFunction } from 'typings';
import { toArray } from 'utils/to-array';

export const editBookmarkMiddleware = async (ctx: ContextWithMessage, next: NextFunction): Promise<Message.TextMessage | void> => {
  const session = (ctx as ContextWithSession).session;
  const { bookmark, apiConfig = {} } = await session.load();

  const topLabels = toArray(bookmark!.TopLabels);

  topLabels.pop();
  topLabels.unshift(bookmark!.Label);

  try {
    const bmark = await (await fetch(`${apiConfig.apiPath}/bookmarks/${bookmark!.Id}`, {
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

    session.set('bookmark', bmark);
  } catch (e) {
    console.error(e);
    return ctx.reply('Sorry! Something went wrong...');
  }

  next();
};