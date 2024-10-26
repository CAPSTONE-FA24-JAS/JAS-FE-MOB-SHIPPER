export interface Response<T> {
  code: number;
  message: string;
  data: T;
  errorMessages: string;
}

export interface dataResponse<T> {
  dataResponse: T[];
  totalItemRepsone: number;
}
