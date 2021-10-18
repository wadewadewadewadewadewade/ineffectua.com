import handerWithUserAndDB from '../../common/utils/passport-local';
import passport from 'passport';

const handler = handerWithUserAndDB;

handler.get((req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) {
      return res.status(400).send({ error: err });
    }

    if (!user) {
      return res.json(false);
    }

    return res.json(user);
  })(req, res, next);
});

handler.post((req, res) => {
  passport.authenticate('local', (err, user) => {
    if (err) {
      return res.status(400).send({ error: err });
    }

    if (!user) {
      return res.status(400).send({ error: 'Sign in failed' });
    }

    // handle login
  });
});

export default handler;
