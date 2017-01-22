/**
 * Created by jack on 1/21/17.
 */
import * as mongoose from 'mongoose';
import {ObjectID} from 'mongodb';


interface ISession extends mongoose.Document {
    day: String;
    start_time: String;
    createdAt: Date;
    updatedAt: Date;
}

export {ISession};