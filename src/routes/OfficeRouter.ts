/**
 * Created by jack on 1/21/17.
 */

import {Router, Request, Response, NextFunction} from 'express';
import {ParsedAsText, ParsedAsJson} from 'body-parser';
import {IOffice} from '../modelInterfaces/IOffice';
import OfficeRepository = require('../database/OfficeRepository');
import {Office} from "../models/Office";
import UserRepository = require("../database/UserRepository");

export class OfficeRouter {
    router: Router;

    /**
     * Initialize the Router
     */
    constructor() {
        this.router = Router();
        this.init();
    }

    getAll(req: Request & ParsedAsJson, res: Response, next: NextFunction) {
        let officeRepo = new OfficeRepository();
        officeRepo.findAll({}, null).then((result) => {
            res.json(result);
        }, err => {
            res.status(500).json(err);
        });
    };

    deleteAll(req: Request & ParsedAsJson, res: Response, next: NextFunction) {
        let officeRepo = new OfficeRepository();
        officeRepo.removeAll().then((result) => {
            res.json(result);
        }, err => {
            res.status(500).json(err);
        });
    };

    test(req: Request & ParsedAsJson, res: Response, next: NextFunction){
        res.json({
            message: 'testing'
        });
    };

    new(req: Request & ParsedAsJson, res: Response, next: NextFunction){
        let userRepo = new UserRepository();
        let officeRepo = new OfficeRepository();

        let office = new Office(req.body);

        officeRepo.create(office).then((result) => {
            userRepo.findById(req.body.user).then(
                (data) => {
                    data.offices.push(result._id);
                    data.save();
                },
                err => err
            );
            res.json(result);
        }, err => {
            res.status(500).json(err);
        });
    };

    /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
    init() {
        this.router.get('/', this.getAll);
        this.router.delete('/', this.deleteAll);
        this.router.post('/', this.new);
    }

}

// Create the TestRouter, and export its configured Express.Router
const gatheringRoutes = new OfficeRouter();
gatheringRoutes.init();

export default gatheringRoutes.router;
