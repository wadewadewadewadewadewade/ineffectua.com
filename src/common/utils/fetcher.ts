export enum EApiEndpoints {
  USERS = 'users',
  USER = 'users/',
  POSTS = 'posts',
  POST = 'posts/',
  VERIFY = 'auth',
  SIGNIN = 'users',
  SIGNUP = 'auth/signup',
  CONFIRMEMAIL = 'auth/confirmemail',
}

const hostnameAndPort = process.env.HOSTNAME_AND_PORT;

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
  let url = `${
    hostnameAndPort ||
    `${window.location.protocol}//${window.location.hostname}${
      window.location.port ? `:${window.location.port}` : ''
    }`
  }/api/${endpoint}`;
  if (endpoint === EApiEndpoints.POST && !!params) {
    url = `${url}${params}`;
  }
  const response = await fetch(url, {
    method,
    credentials: 'include',
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
