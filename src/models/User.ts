import * as mongoose from 'mongoose';
import {IUser} from '../modelInterfaces/IUser';
import { ObjectID }  from 'mongodb';
import {Office} from "./Office";
let Schema = mongoose.Schema;

let userSchema = new Schema({
    provider: String,
    name: String,
    email: String,
    picture_url: String,
    office: [{type: mongoose.Schema.Types.ObjectId, ref: 'Office'}],
}, {
    timestamps: true
});

let UserModel = mongoose.model < IUser >('User', userSchema);

class User {
    public name: String;
    public email: String;
    public picture_url: String;
    public offices: [{type: mongoose.Schema.Types.ObjectID, ref: 'Office'}];
    public createdAt: Date;
    public updatedAt: Date;

    constructor(user: Object) {
        this.name = user['name'];
        this.email = user['email'];
        this.picture_url = user['picture_url'];
        this.offices = user['offices'];
        this.createdAt = user['createdAt'];
        this.updatedAt = user['updatedAt'];
    }
}
// make this available to our users in our Node applications
export {UserModel, User};