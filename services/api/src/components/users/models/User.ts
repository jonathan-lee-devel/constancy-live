import {model, Model, Schema} from 'mongoose';

export interface IUser extends Document {
  email: string;
  firstName: string | undefined;
  lastName: string | undefined;
  password: string | undefined;
  emailVerified: boolean;
  googleId: string | undefined;
}

export interface IUserModel extends Model<IUser> {}

const schema = new Schema<IUser>({
  email: {type: String, required: true, unique: true},
  firstName: {type: String, required: false, unique: false},
  lastName: {type: String, required: false, unique: false},
  password: {type: String, required: false, unique: false},
  emailVerified: {type: Boolean, required: true, unique: false},
  googleId: {type: String, required: false, unique: true},
}, {timestamps: true});

const User: IUserModel = model<IUser, IUserModel>('User', schema);

export default User;
