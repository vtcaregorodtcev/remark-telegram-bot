// @ts-ignore
import taws from 'telegraf-aws';
import { Telegraf } from 'telegraf';
import { BOT_HOOK_PATH, BOT_TOKEN, SESSION_TABLE_NAME } from '../constants';
import { apiConfigMiddleware } from 'middlewares/api-config';
import { setApiPathCommand } from 'commands/set-api-path';
import { setApiXKeyCommand } from 'commands/set-api-x-key';
import { clearCommand } from 'commands/clear';
import { detectLinkMiddleware } from 'middlewares/detect-link';
import { loadPageTextMiddleware } from 'middlewares/load-page-text';
import { createBookmarkMiddleware } from 'middlewares/create-bookmark';
import { remarkLinkMiddleware } from 'middlewares/remark-link';
import { editBookmarkMiddleware } from 'middlewares/edit-bookmark';
import { Session } from 'middlewares/session';
import { DynamoDB } from 'aws-sdk';
import { resultsMiddleware } from 'middlewares/results';

const bot = new Telegraf(BOT_TOKEN, {
  telegram: { webhookReply: true }
});

bot.telegram.setWebhook(BOT_HOOK_PATH);
bot.use(new Session(new DynamoDB(), SESSION_TABLE_NAME).middleware());

// TODO: update with info about all commands
// TODO: add /help and /new commands
bot.start((ctx) => ctx.reply('Hello'));

bot.command('/apiPath', setApiPathCommand);
bot.command('/apiXKey', setApiXKeyCommand);
bot.command('/clear', clearCommand);

// --- update bookmarks ---
bot.hears(/^🔖\s\S+/, apiConfigMiddleware, remarkLinkMiddleware);
bot.hears(/^✏️ edit\s\S+/, apiConfigMiddleware, editBookmarkMiddleware, resultsMiddleware);

// --- main flow ---
bot.on('text', apiConfigMiddleware, detectLinkMiddleware, loadPageTextMiddleware, createBookmarkMiddleware, resultsMiddleware);

export const handler = taws(bot, { timeout: 1000 });