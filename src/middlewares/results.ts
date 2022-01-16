import { Markup } from 'telegraf';
import { Message } from 'telegraf/typings/core/types/typegram';
import { ContextWithMessage, ContextWithSession } from 'typings';
import { toArray } from 'utils/to-array';

export const resultsMiddleware = async (ctx: ContextWithMessage): Promise<Message.TextMessage> => {
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
};