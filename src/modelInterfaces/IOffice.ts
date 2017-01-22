/**
 * Created by jack on 1/21/17.
 */
import * as mongoose from 'mongoose';
import {ObjectID} from 'mongodb';
import {Session} from "../models/Session";


interface IOffice extends mongoose.Document {
    location: String;
    name: String;
    description: String;
    sessions: [{type: mongoose.Schema.Types.ObjectId, ref: 'Session'}];
    queue: [{
        id: String,
        name: String,
    }],
    miniQueue: [String],
    user_id: [{
        id: String,
        name: String,
        picture_url: String,
        email: String
    }],
    active: Boolean;
    createdAt: Date;
    updatedAt: Date;
}

export {IOffice};