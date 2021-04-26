import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import config from '../../../../config/config';
import User from '../../module.user/models/user.model';

const signin = async (req, res) => {
  try {
    let user = await User.findOne({
      email: req.body.email,
    });

    if (!user)
      return res.status('401').json({
        error: 'Користувач не знайдений.',
      });

    if (!user.authenticate(req.body.password)) {
      return res.status('401').send({
        error: 'Email та пароль не підходять.',
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      config.jwtSecret
    );

    res.cookie('t', token, {
      expire: new Date() + 9999,
    });

    return res.json({
      token,
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.log(err);
    return res.status('401').json({
      error: 'Невдала спроба входу',
    });
  }
};

const signout = (req, res) => {
  res.clearCookie('t');
  return res.status('200').json({
    message: 'Вихід виконано',
  });
};

const requireSignin = expressJwt({
  secret: config.jwtSecret,
  userProperty: 'auth',
});

const hasAuthorization = (req, res, next) => {
  const authorized = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!authorized) {
    return res.status('403').json({
      error: 'Користувач не авторизований',
    });
  }
  next();
};

export default {
  signin,
  signout,
  requireSignin,
  hasAuthorization,
};
