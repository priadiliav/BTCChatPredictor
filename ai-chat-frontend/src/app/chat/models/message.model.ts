export interface IMessage {
  id: number,
  question?: IQuestion;
  response: IResponse;
}

export interface IResponse {
  title: string;
  text: string;
  loaded: boolean;
}

export interface IQuestion {
  text: string,
  date: string
  user: string
}

