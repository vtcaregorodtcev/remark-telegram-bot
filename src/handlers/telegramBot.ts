// @ts-ignore
import taws from 'telegraf-aws';
import { Telegraf, Markup } from 'telegraf';
import { BOT_HOOK_PATH, BOT_TOKEN, SESSION_TABLE_NAME } from '../constants';
import { apiConfigMiddleware } from 'middlewares/api-config';
import { setApiPathCommand } from 'commands/set-api-path';
import { setApiXKeyCommand } from 'commands/set-api-x-key';
import { clearCommand } from 'commands/clear';
import { detectLinkMiddleware } from 'middlewares/detect-link';
import { loadPageTextMiddleware } from 'middlewares/load-page-text';
import { createBookmarkMiddleware } from 'middlewares/create-bookmark';
import { ContextWithSession } from 'typings';
import { toArray } from 'utils/to-array';
import { remarkLinkMiddleware } from 'middlewares/remark-link';
import { editBookmarkMiddleware } from 'middlewares/edit-bookmark';
import { Session } from 'middlewares/session';
import { DynamoDB } from 'aws-sdk';

const bot = new Telegraf(BOT_TOKEN, {
  telegram: { webhookReply: true }
});

bot.telegram.setWebhook(BOT_HOOK_PATH);
bot.use(new Session(new DynamoDB(), SESSION_TABLE_NAME).middleware());

bot.start((ctx) => ctx.reply('Hello'));

bot.command('/apiPath', setApiPathCommand);
bot.command('/apiXKey', setApiXKeyCommand);
bot.command('/clear', clearCommand);

bot.hears(/^🔖\s\S+/, apiConfigMiddleware, remarkLinkMiddleware);

bot.on(
  'text',
  apiConfigMiddleware,
  detectLinkMiddleware,
  loadPageTextMiddleware,
  createBookmarkMiddleware,
  editBookmarkMiddleware,
  async (ctx) => {
    const bookmark = (await (ctx as ContextWithSession).session.get('bookmark'))!;
    const topLabels = toArray(bookmark.TopLabels);

    const text = !bookmark.IsRemarked
      ? `Here is the TOP of possible labels. Please choose the more suitable one.
        \nIf I did it completely wrong, please, use [ /new right_label ] command.`
      : 'This Link is already remarked.';

    const markup = Markup.keyboard([[
      ...(
        !bookmark.IsRemarked
          ? (topLabels.map(label => `🔖 ${label}`))
          : [`✏️ edit [ ${bookmark.Label} ]`]
      )
    ]])
      .oneTime()
      .resize()
      .selective();

    return ctx.reply(text, markup);
  });

export const handler = taws(bot, { timeout: 1000 });