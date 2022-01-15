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

export type ExtContext = Context & {
  session: {
    apiConfig?: {
      apiPath?: string
      apiXKey?: string
    },
    Link?: string;
    Text?: string;
    bookmark?: Bookmark | null;
  }
}