import * as mongoose from 'mongoose';
import {IUser} from '../modelInterfaces/IUser';
import { ObjectID }  from 'mongodb';
import {Office, officeSchema} from "./Office";
let Schema = mongoose.Schema;

let userSchema = new Schema({
    provider: String,
    id: String,
    name: String,
    email: String,
    picture_url: String,
    offices: [officeSchema],
    queues: Array,
}, {
    timestamps: true
});

let UserModel = mongoose.model < IUser >('User', userSchema);

class User {
    public id:String;
    public name: String;
    public email: String;
    public picture_url: String;
    public offices: [{type: mongoose.Schema.Types.ObjectId, ref: 'Office'}];
    public queues: Array;
    public createdAt: Date;
    public updatedAt: Date;

    constructor(user: Object) {
        this.id = user['id'];
        this.name = user['name'];
        this.email = user['email'];
        this.picture_url = user['picture_url'];
        this.offices = user['offices'];
        this.queues = user['queues'];
        this.createdAt = user['createdAt'];
        this.updatedAt = user['updatedAt'];
    }
}
// make this available to our users in our Node applications
export {UserModel, User, userSchema};