import { Context } from 'telegraf';
import { Message } from 'telegraf/typings/core/types/typegram';
import { ExtContext, NextFunction } from 'typings';
import fetch from 'node-fetch';
import { parse } from 'node-html-parser';

const preprocess = (s: string) => {
  const lower = s.toLowerCase();
  const alphanums = lower
    .replace(/[^a-zA-Z]+/g, ' ') // only characters
    .replace(/http\S+/g, '') // without urls
    .replace(/\s\s+/g, ' '); // without multiple spaces

  return alphanums;
};

export const loadPageTextMiddleware = async (ctx: Context, next: NextFunction): Promise<Message.TextMessage | void> => {
  const url = (ctx as ExtContext).session.Link;

  if (!url) {
    (ctx as ExtContext).session.Link = '';
    return ctx.reply('Please, provide valid URL');
  }

  try {
    const text = await (await fetch(url)).text();
    const html = parse(text);

    const Text = preprocess(html.querySelector('body')?.innerText || '');

    (ctx as ExtContext).session.Text = Text;
  } catch {
    (ctx as ExtContext).session.Text = '';
  }

  next();
};
