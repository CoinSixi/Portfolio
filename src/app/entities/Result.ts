export class Result<T> {
  code: number;
  msg: string;
  detail: string;
  duration: number;
  data: T;
}
