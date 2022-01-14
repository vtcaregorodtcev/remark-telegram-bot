import { Context } from 'telegraf';

export type NextFunction = () => void;

export type ExtContext = Context & {
  session: {
    apiConfig?: {
      apiPath?: string
      apiXKey?: string
    }
  }
}