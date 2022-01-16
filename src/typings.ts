import { Context } from 'telegraf';

export type Bookmark = {
  Id?: string;
  Label: string;
  Link: string;
  Name: string;
  Text: string;
  TopLabels: string;
  IsRemarked: boolean;
}

export type NextFunction = () => void;

export type ApiConfig = {
  apiPath?: string
  apiXKey?: string
}

export type SessionType = {
  id?: string;
  apiConfig?: ApiConfig,
  Link?: string;
  Text?: string;
  bookmark?: Bookmark;
}

export type ContextWithMessage = Context & { message: { text: string } };

export type ContextWithSession = Context & {
  session: {
    load: () => Promise<SessionType>,
    get: <K extends keyof SessionType>(name: K) => Promise<SessionType[K]>,
    set: <K extends keyof SessionType>(name: K, value: SessionType[K]) => Promise<void>
  }
}