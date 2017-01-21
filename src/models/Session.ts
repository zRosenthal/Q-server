/**
 * Created by jack on 1/21/17.
 */
import * as mongoose from 'mongoose';
import {ISession} from '../modelInterfaces/ISession';
import {ObjectID} from 'mongodb';
let Schema = mongoose.Schema;

let sessionSchema = new Schema({
    day: String,
    start_time: String,
    end_time: String,
    active: Boolean,
}, {
    timestamps: true
});

let SessionModel = mongoose.model < ISession >('Session', sessionSchema);

class Session {
    public day: String;
    public start_time: String;
    public end_time: String;
    public active: Boolean;
    public createdAt: Date;
    public updatedAt: Date;

    constructor(session: Object) {
        this.day = session['day'];
        this.start_time = session['start_time'];
        this.end_time = session['end_time'];
        this.active = session['active'];
        this.createdAt = session['createdAt'];
        this.updatedAt = session['updatedAt'];
    }
}
// make this available to our users in our Node applications
export {SessionModel, Session};