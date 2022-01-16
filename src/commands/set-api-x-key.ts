import { Message } from 'telegraf/typings/core/types/typegram';
import { ContextWithMessage, ContextWithSession } from 'typings';

export const setApiXKeyCommand = async (ctx: ContextWithMessage): Promise<Message.TextMessage> => {
  const apiXKey = ctx.message.text.split(' ')[1];

  if (!apiXKey) {
    return ctx.reply('Invalid use of command.\n\nUse [ /apiXKey api_key ] syntax');
  }

  const session = (ctx as ContextWithSession).session;

  const config = await session.get('apiConfig') || {};
  await session.set('apiConfig', { ...config, apiXKey });

  return ctx.reply(`You have set API X-Key: ${apiXKey}`);
};