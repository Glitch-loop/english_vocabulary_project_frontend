import { EAlert } from "./enums";

export interface IAlert {
  alertType: EAlert;
  message?: string;
  dismissTime?: number;
}

export interface IApp {
  currentAlert?: IAlert;
  queueAlert: IAlert[];
}

export interface IGif {
  type: string;
  id: string;
  slug: string;
  url: string;
  bitly_url: string;
  embed_url: string;
  username: string;
  source: string;
  rating: string;
  content_url: string;
  source_tld: string;
  source_post_url: string;
  title: string;
  alt_text: string;
  image: any;
}

export interface ILanguage {
  id_language: number;
  language_name: string;
}

export interface IExample {
  id_example: number;
  example: string;
  id_meaning: number;
}

export interface ITopic {
  id_topic: number;
  topic_name: string;
}

export interface IWord_class {
  id_word_class: number;
  word_class: string;
  language?: ILanguage;
}

export interface IMeaning {
  id_meaning: number;
  meaning: string;
  source: string;
  recently_practiced: number;
  times_practiced: number;
  id_word: number;
  id_word_class: number;
  id_topic: number;
  examples: IExample[];
}

export interface IWord {
  id_word: number;
  word: string;
  meanings: IMeaning[];
}

interface IResponse<T> {
  statusCode: number;
  response?: T;
  reason?: {
    sqlMessage: string;
    sqlCode: string;
    sqlErroCode: number;
    errorCode: number;
    customError?: string;
  }
}

export interface IRequest<T> {
  success: boolean,
  response: IResponse<T>
}

export interface IImportWordExcel {
  word: string;
  meaning: string;
  id_topic: number;
  id_word_class: number;
}
