// @ts-ignore
import taws from 'telegraf-aws';
import { Telegraf } from 'telegraf';
import Session from 'telegraf-session-local';
import { BOT_HOOK_PATH, BOT_TOKEN } from '../constants';
import { apiConfigMiddleware } from 'middlewares/api-config';
import { setApiPathCommand } from 'commands/set-api-path';
import { setApiXKeyCommand } from 'commands/set-api-x-key';
import { clearCommand } from 'commands/clear';

const bot = new Telegraf(BOT_TOKEN, {
  telegram: { webhookReply: true }
});

bot.telegram.setWebhook(BOT_HOOK_PATH);
bot.use(new Session({ database: '/tmp/session.json' }));

bot.start((ctx) => ctx.reply('Hello'));

bot.command('/apiPath', setApiPathCommand);
bot.command('/apiXKey', setApiXKeyCommand);
bot.command('/clear', clearCommand);

bot.on('text', apiConfigMiddleware, (ctx) => ctx.reply('text'));

export const handler = taws(bot, { timeout: 1000 });