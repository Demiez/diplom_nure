import mongoose from 'mongoose';
import crypto from 'crypto';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: `Заповніть поле ім'я та прізвище`,
  },
  email: {
    type: String,
    trim: true,
    unique: 'Email вже існує',
    match: [/.+\@.+\..+/, 'Введіть вірний email'],
    required: 'Заповніть поле email',
  },
  hashed_password: {
    type: String,
    required: `Заповніть поле пароль`,
  },
  salt: String,
  updated: Date,
  created: {
    type: Date,
    default: Date.now,
  },
  about: {
    type: String,
    trim: true,
  },
  department: {
    type: String,
    trim: true,
  },
  specialty: {
    type: String,
    trim: true,
  },
  photo: {
    data: Buffer,
    contentType: String,
  },
  following: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  followers: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
});

UserSchema.virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

UserSchema.path('hashed_password').validate(function (v) {
  if (this._password && this._password.length < 6) {
    this.invalidate('password', 'Пароль повинен мати 6 знаків.');
  }
  if (this.isNew && !this._password) {
    this.invalidate('password', 'Введіть пароль');
  }
}, null);

UserSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },
  encryptPassword: function (password) {
    if (!password) return '';
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
    } catch (err) {
      return '';
    }
  },
  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + '';
  },
};

export default mongoose.model('User', UserSchema);
