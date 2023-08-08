import { model, Model, Schema } from 'mongoose';

export interface IRegistrationVerificationToken extends Document {
  value: string;
  expiryDate: Date;
  userEmail: string;
}

export interface IRegistrationVerificationTokenModel extends Model<IRegistrationVerificationToken> {}

const schema = new Schema<IRegistrationVerificationToken>({
  value: { type: String, required: true, unique: true },
  expiryDate: { type: Date, required: true, unique: false },
  userEmail: { type: String, required: true, unique: true }
}, { timestamps: true });

const RegistrationVerificationToken: IRegistrationVerificationTokenModel = model<IRegistrationVerificationToken, IRegistrationVerificationTokenModel>('RegistrationVerificationToken', schema);

export default RegistrationVerificationToken;
