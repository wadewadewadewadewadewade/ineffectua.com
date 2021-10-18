export enum EApiEndpoints {
  USERS = 'users',
  USER = 'users/',
  POSTS = 'posts',
  POST = 'posts/',
  VERIFY = 'auth',
  SIGNIN = 'users',
  SIGNUP = 'users',
}

const fetcher = async (
  method: RequestInit['method'],
  endpoint: EApiEndpoints,
  params?: string,
  body?: BodyInit,
  headers: HeadersInit = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
) => {
  let url = `http://localhost:3333/api/${endpoint}`;
  if (endpoint === EApiEndpoints.POST && !!params) {
    url = `${url}${params}`;
  }
  const response = await fetch(url, {
    method,
    ...(headers ? { headers } : {}),
    body,
  });
  if (response.ok) {
    if ('Accept' in headers && headers.Accept === 'application/json') {
      return await response.json();
    } else {
      return await response.text();
    }
  }
  const error = new Error(response.statusText);
  throw error;
};

export default fetcher;
