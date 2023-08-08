import { model, Model, Schema } from 'mongoose';

export interface IPasswordResetVerificationToken extends Document {
  value: string;
  expiryDate: Date;
  userEmail: string;
}

export interface IPasswordResetVerificationTokenModel extends Model<IPasswordResetVerificationToken> {}

const schema = new Schema<IPasswordResetVerificationToken>({
  value: { type: String, required: true, unique: true },
  expiryDate: { type: Date, required: true, unique: false },
  userEmail: { type: String, required: true, unique: true }
}, { timestamps: true });

const PasswordResetVerificationToken: IPasswordResetVerificationTokenModel = model<IPasswordResetVerificationToken, IPasswordResetVerificationTokenModel>('PasswordResetVerificationToken', schema);

export default PasswordResetVerificationToken;
