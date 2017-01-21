/**
 * Created by jack on 1/21/17.
 */
import * as mongoose from 'mongoose';
import {ObjectID} from 'mongodb';


interface ISession extends mongoose.Document {
    day: String;
    start_time: String;
    end_time: String;
    active: Boolean;
    createdAt: Date;
    updatedAt: Date;
}

export {ISession};