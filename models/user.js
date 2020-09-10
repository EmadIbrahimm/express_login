const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
  username: String,
  firstname: String,
  surname: String,
  password: {
    type: String,
    required: true
   },
  password_confirm: String,
  user_email: {
      type: String,
      required: true,
  }
});

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', UserSchema);

module.exports = User;