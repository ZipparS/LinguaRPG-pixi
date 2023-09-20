import { Schema, model } from "mongoose";

export interface IAccount {
    username: string,
    password: string,
}

export const accountSchema = new Schema<IAccount>({
    username: String,
    password: String,
}, { collection: 'account' });

export const Account = model('account', accountSchema);

export interface IProgress {
    name: string,
    username: string,
    questsCompleted: Array<string>,

    location: string,
    x: number,
    y: number,

    texture: string,
    portrait: string,

    online: boolean,
}

export const progressSchema = new Schema<IProgress>({
    name: String,
    username: String,
    questsCompleted: Array<String>,

    location: String,
    x: Number,
    y: Number,

    texture: String,
    portrait: String,

    online: Boolean,
}, { collection: 'progress' });

export const Progress = model('progress', progressSchema);
