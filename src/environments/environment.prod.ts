export interface Environment {
  production: boolean,
  apiUrl: string;
}

export const environment: Environment = {
  production: true,
  apiUrl: 'http://174.104.209.51:8084'
};
