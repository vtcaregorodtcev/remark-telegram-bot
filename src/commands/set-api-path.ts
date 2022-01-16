import { Message } from 'telegraf/typings/core/types/typegram';
import { ContextWithMessage, ContextWithSession } from 'typings';

export const setApiPathCommand = async (ctx: ContextWithMessage): Promise<Message.TextMessage> => {
  const apiPath = ctx.message.text.split(' ')[1];

  if (!apiPath) {
    return ctx.reply('Invalid use of command.\n\nUse [ /apiPath path_to_backend ] syntax');
  }

  const session = (ctx as ContextWithSession).session;

  const config = await session.get('apiConfig') || {};
  await session.set('apiConfig', { ...config, apiPath });

  return ctx.reply(`You have set API path: ${apiPath}`);
};