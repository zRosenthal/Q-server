import * as mongoose from 'mongoose';
import { ObjectID } from 'mongodb';
/**
 * Created by evan on 11/18/16.
 */

interface IUser extends mongoose.Document {
    name: String;
    email: String;
    picture_url: String,
    offices: [{type: mongoose.Schema.Types.ObjectID, ref: 'Office'}],
    createdAt: Date;
    updatedAt: Date;
}

export {IUser};