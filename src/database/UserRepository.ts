import Repository = require('./Repository');
import {IUser} from '../modelInterfaces/IUser';
import {UserModel, User} from '../models/User';
import * as mongoose from 'mongoose';


class UserRepository extends Repository<IUser, User> {
    constructor() {
        super(<mongoose.Model<IUser>>UserModel);
    }

    findOneOrCreate(id, user: User): Promise <any> {
        return new Promise<any>((resolve, reject) => {
            this.findOne({id: id}).then(
                user => resolve(user),
                (err) => {
                    console.log('err: ', err);
                    this.create(user).then(
                        user => {
                            console.log('userIn: ', user);
                            resolve(user)
                        },
                        err => reject(err)
                    )
                }
            );
        });
    }
}

export = UserRepository;