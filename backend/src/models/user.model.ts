//login, signup
import { Schema, Document, model, Types } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
    _id: Types.ObjectId;
    username: string;
    email: string;
    password: string;
    comparePassword(candidatePassword: string): Promise<boolean>
}

const UserSchema: Schema = new Schema<IUser>(
    {
        username: { type: String, required: true },
        email:    { type: String, required: true, unique: true },
        password: { type: String, required: true }
    },
    { timestamps: true}
);

//hash password
UserSchema.pre<IUser>('save', async function (next) {
    if(!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(this.password, salt);
        this.password = hash;
        next();
    } catch(error: any){
        next(error);
    }
});

//password for login
UserSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

export default model<IUser>('User', UserSchema);