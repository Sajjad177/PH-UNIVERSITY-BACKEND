import { model, Schema } from 'mongoose';
import config from '../../config';
import bcrypt from 'bcrypt';
import { TUser, UserModel } from './user.interface';

const userSchema = new Schema<TUser, UserModel>(
  {
    id: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    needsPasswordChange: { type: Boolean, default: true },
    role: {
      type: String,
      enum: ['admin', 'student', 'faculty'],
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['in-progress', 'blocked'],
      default: 'in-progress',
    },
  },
  { timestamps: true },
);

//TODO : createing pre save hook or middleware :
userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds),
  );

  next();
});

//TODO : createing post save hook or middleware after saving the password :
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

// cteating static method function : id checking method
userSchema.statics.isUserExistsByCustomID = async function (id: string) {
  return await User.findOne({ id });
};

// checking user is deleted or not :
userSchema.statics.isUserDeletedChecking = async function ( isDeleted: boolean) {  
  return await User.findOne({ isDeleted });
};

// checking user is blocked or not :
userSchema.statics.isUserStatusChecking = async function ( status: string) {
  return await User.findOne({ status });
};


// password match method :
userSchema.statics.isPasswordMatch = async function (password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword);
};



export const User = model<TUser, UserModel>('User', userSchema);
