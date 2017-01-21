/**
 * Created by jack on 1/21/17.
 */
import * as mongoose from 'mongoose';
import {IOffice} from '../modelInterfaces/IOffice';
import {ObjectID} from 'mongodb';
import {Session} from "./Session";
let Schema = mongoose.Schema;

let officeSchema = new Schema({
    location: String,
    name: String,
    description: String,
    sessions: [{type: mongoose.Schema.Types.ObjectId, ref: 'Session'}],
    queue: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
}, {
    timestamps: true
});

let OfficeModel = mongoose.model < IOffice >('Office', officeSchema);

class Office {
    public location: String;
    public name: String;
    public description: String;
    public sessions: [{type: mongoose.Schema.Types.ObjectId, ref: 'Session'}],
    public queue: [{type: mongoose.Schema.Types.ObjectID, ref: 'User'}];
    public createdAt: Date;
    public updatedAt: Date;

    constructor(office: Object) {
        this.location = office['location'];
        this.name = office['name'];
        this.description = office['description'];
        this.sessions = office['session'];
        this.queue = office['queue'];
        this.createdAt = office['createdAt'];
        this.updatedAt = office['updatedAt'];
    }
}
// make this available to our users in our Node applications
export {OfficeModel, Office};