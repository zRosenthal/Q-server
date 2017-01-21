import Repository = require('./Repository');
import {IUser} from '../modelInterfaces/IUser';
import {UserModel, User} from '../models/User';
import * as mongoose from 'mongoose';

class UserRepository extends Repository<IUser, User> {
    constructor() {
        super(<mongoose.Model<IUser>>UserModel);
    }

    findOrCreate(object: Object): Promise <any> {
        return this.findOne({id: object.id})
            .then(user => {
                if (user) {
                    console.log(`user: ${JSON.stringify(user)}`);
                    return user;
                }
                return this.create(object as U);
            }, err => {
                console.log(err);
                return err;
            });
    }

}

export = UserRepository;