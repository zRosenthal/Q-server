/**
 * Created by jack on 1/21/17.
 */
import Repository = require('./Repository');
import {ISession} from '../modelInterfaces/ISession';
import {SessionModel, Session} from '../models/Session';
import * as mongoose from 'mongoose';

class SessionRepository extends Repository<ISession, Session> {
    constructor() {
        super(<mongoose.Model<ISession>>SessionModel);
    }
}

export = SessionRepository;