/**
 * Created by jack on 1/21/17.
 */
import * as mongoose from 'mongoose';
import {IOffice} from '../modelInterfaces/IOffice';
import {ObjectID} from 'mongodb';
import {Session, sessionSchema} from "./Session";
let Schema = mongoose.Schema;

let officeSchema = new Schema({
    location: String,
    name: String,
    description: String,
    sessions: [sessionSchema],
    queue: [{
        id: String,
        name: String,
        picture_url: String,
        email: String
    }],
    miniQueue: [String],
    user_id: [{
        id: String,
        name: String,
    }],
    active: Boolean,
}, {
    timestamps: true
});

let OfficeModel = mongoose.model < IOffice >('Office', officeSchema);

class Office {
    public location: String;
    public name: String;
    public description: String;
    public sessions: [{type: mongoose.Schema.Types.ObjectId, ref: 'Session'}];
    public queue: [{
        id: String,
        name: String,
        picture_url: String,
        email: String
    }];
    public miniQueue: [String];
    public user_id: [{
        id: String,
        name: String,
    }];
    public active: Boolean;
    public createdAt: Date;
    public updatedAt: Date;

    constructor(office: Object) {
        this.location = office['location'];
        this.name = office['name'];
        this.description = office['description'];
        this.sessions = office['session'];
        this.queue = office['queue'];
        this.miniQueue = office['miniQueue'];
        this.user_id = office['user_id'];
        this.active = office['active'];
        this.createdAt = office['createdAt'];
        this.updatedAt = office['updatedAt'];
    }
}
// make this available to our users in our Node applications
export {OfficeModel, Office, officeSchema};