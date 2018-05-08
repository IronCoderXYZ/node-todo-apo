const _ = require('lodash');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { isEmail } = require('validator');

const UserSchema = new mongoose.Schema({
  email: {
    trim: true,
    minlength: 1,
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    minlength: 4,
    required: true
  },
  tokens: [
    {
      token: {
        type: String,
        required: true
      },
      access: {
        type: String,
        required: true
      }
    }
  ]
});

UserSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();
  return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function() {
  const user = this;
  const access = 'auth';
  const token = jwt
    .sign({ _id: user._id.toHexString(), access }, 'abc123')
    .toString();
  user.tokens = user.tokens.concat([{ access, token }]);
  return user.save().then(() => token);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
