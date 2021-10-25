## ineffectua.com

I thought I might use [MongoDB](https://www.mongodb.com/) and [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) to maybe make ineffectua.com and develop my knowledge of different tech a bit.

Includes [Material-UI](https://mui.com/) which relies on [Emotion](https://emotion.sh/docs/introduction) and AWS support via [aws-sdk](https://github.com/aws/aws-sdk-js), which is probably overkill just to use S3 for images.

### TODO

- since user data is encoded into header, when that changes (like confirmation email sent), we need to update that header
- change the Posts page so that the posts aren't hidden by default (but reply posts are)
- wire in sendConfirmationEmail including new webhook
- add user profile page
- add ability resize images in posts
- Maybe get different posts depending on if authenticated?

### Status

- `2021-10-23`: Got Graphqul working, with exceptions for some todo items...
- `2021-10-13`: Trying Auth0 instead of Userfront, as it seems more well built-out. And there's stil a bug recognizing the user after authentication...
- `2021-10-12`: Working on adding user support via Userfront, but have two questions for userfront support: how do I create a user via the API and set that user's password, and how do I get localhost:3000 to be authorized to make requests?
- `2021-10-11`: Added image support via AWS S3
- `2021-10-08`: This is merely a sandbox I've only just started
