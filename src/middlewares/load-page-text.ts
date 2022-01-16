import { Message } from 'telegraf/typings/core/types/typegram';
import { ContextWithMessage, ContextWithSession, NextFunction } from 'typings';
import fetch from 'node-fetch';
import { parse } from 'node-html-parser';
import { isEditCommand } from 'utils/is-edit-command';

const preprocess = (s: string) => {
  const lower = s.toLowerCase();
  const alphanums = lower
    .replace(/[^a-zA-Z]+/g, ' ') // only characters
    .replace(/http\S+/g, '') // without urls
    .replace(/\s\s+/g, ' '); // without multiple spaces

  return alphanums;
};

export const loadPageTextMiddleware = async (ctx: ContextWithMessage, next: NextFunction): Promise<Message.TextMessage | void> => {
  if (!isEditCommand(ctx.message.text)) {
    const session = (ctx as ContextWithSession).session;

    const url = await session.get('Link');

    if (!url) {
      session.set('Link', '');
      return ctx.reply('Please, provide valid URL');
    }

    try {
      const text = await (await fetch(url)).text();
      const html = parse(text);

      const Text = preprocess(html.querySelector('body')?.innerText || '');

      await session.set('Text', Text);
    } catch {
      session.set('Text', '');
    }
  }

  next();
};
