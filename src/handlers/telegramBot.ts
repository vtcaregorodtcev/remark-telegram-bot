// @ts-ignore
import taws from 'telegraf-aws';
import { Telegraf } from 'telegraf';
import { BOT_HOOK_PATH, BOT_TOKEN } from '../constants';

const bot = new Telegraf(BOT_TOKEN, {
  telegram: { webhookReply: true }
});

bot.telegram.setWebhook(BOT_HOOK_PATH);

bot.start((ctx) => ctx.reply('Hello'));

export const handler = taws(bot, { timeout: 1000 });