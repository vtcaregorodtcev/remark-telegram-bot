import fetch from 'node-fetch';
import { Message } from 'telegraf/typings/core/types/typegram';
import { ContextWithMessage, ContextWithSession } from 'typings';

export const remarkLinkMiddleware = async (ctx: ContextWithMessage): Promise<Message.TextMessage | void> => {
  const Label = ctx.message.text.split('🔖 ')[1];

  const session = (ctx as ContextWithSession).session;
  const { bookmark, apiConfig = {} } = await session.load();

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

    session.set('bookmark', undefined);
  } catch (e) {
    console.error(e);
    return ctx.reply('Sorry! Something went wrong...');
  }

  return ctx.reply(`You have successfully remarked [${bookmark.Link}] as ${Label}!`);
};