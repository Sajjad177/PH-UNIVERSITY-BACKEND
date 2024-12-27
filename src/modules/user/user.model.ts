import { model, Schema } from 'mongoose';
import config from '../../config';
import bcrypt from 'bcrypt';
import { TUser, UserModel } from './user.interface';
import { userStatus } from './user.constant';

const userSchema = new Schema<TUser, UserModel>(
  {
    id: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    passwordChangeAt: { type: Date },
    needsPasswordChange: { type: Boolean, default: true },
    role: {
      type: String,
      enum: ['admin', 'student', 'faculty','superAdmin'],
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
    status: {
      type: String,
      enum: userStatus,
      default: 'in-progress',
    },
  },
  { timestamps: true },
);

//TODO : createing pre save hook or middleware for hashing the password :
userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds),
  );

  next();
});

//TODO : This middleware is used to remove the password from the response is send to the client :
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

// cteating static method function : id checking method [this method is used to check the user is exists or not by id]
userSchema.statics.isUserExistsByCustomID = async function (id: string) {
  return await User.findOne({ id }).select('+password');
};

// checking user is deleted or not : [this method is used to check the user is deleted or not]
userSchema.statics.isUserDeletedChecking = async function (isDeleted: boolean) {
  return await User.findOne({ isDeleted });
};

// checking user is blocked or not :
userSchema.statics.isUserStatusChecking = async function (status: string) {
  return await User.findOne({ status });
};

// password match method :
userSchema.statics.isPasswordMatch = async function (
  password: string,
  hashedPassword: string,
) {
  return await bcrypt.compare(password, hashedPassword);
};

// function to check jwt issued time is before password change time : [if any one hacked jwt token then we checking iat and passwordChangeAt time]
// iat : token issued at time :
// passwordChangeAt : password change at time :
// if iat is bigger than passwordChangeAt time then it's mean that the jwt token is hacked then before token is invalid :

userSchema.statics.isJwtIssuedBeforePasswordChange = function (
  passwordChangeTimeStamp: Date,
  jwtIssuedTimeStamp: number,
) {
  const passwordChangeTime = new Date(passwordChangeTimeStamp).getTime() / 1000;

  // passwordChangeTime is greater than jwtIssuedTimeStamp
  return passwordChangeTime > jwtIssuedTimeStamp;
};

export const User = model<TUser, UserModel>('User', userSchema);
