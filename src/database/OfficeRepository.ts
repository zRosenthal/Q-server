/**
 * Created by jack on 1/21/17.
 */
import Repository = require('./Repository');
import {IOffice} from '../modelInterfaces/IOffice';
import {OfficeModel, Office} from '../models/Office';
import * as mongoose from 'mongoose';

class OfficeRepository extends Repository<IOffice, Office> {
    constructor() {
        super(<mongoose.Model<IOffice>>OfficeModel);
    }
}

export = OfficeRepository;