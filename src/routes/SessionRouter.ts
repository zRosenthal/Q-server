/**
 * Created by jack on 1/21/17.
 */

import {Router, Request, Response, NextFunction} from 'express';
import {ParsedAsText, ParsedAsJson} from 'body-parser';
import {ISession} from '../modelInterfaces/ISession';
import SessionRepository = require('../database/SessionRepository');
import {Session} from "../models/Session";
import {Office} from "../models/Office";
import OfficeRepository = require("../database/OfficeRepository");
import resolve = Q.resolve;

export class SessionRouter {
    router: Router;

    /**
     * Initialize the Router
     */
    constructor() {
        this.router = Router();
        this.init();
    }

    getAll(req: Request & ParsedAsJson, res: Response, next: NextFunction) {
        let sessionRepo = new SessionRepository();
        sessionRepo.findAll({}, null).then((result) => {
            res.json(result);
        }, err => {
            res.status(500).json(err);
        });
    };

    deleteAll(req: Request & ParsedAsJson, res: Response, next: NextFunction) {
        let sessionRepo = new SessionRepository();
        sessionRepo.removeAll().then((result) => {
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
        let sessionRepo = new SessionRepository();
        let officeRepo = new OfficeRepository();

        let session = new Session(req.body);

        let office = officeRepo.findById(req.body.office).then((resolve, request) => {
            resolve(request);
        }, err => {
            res.status(500).json(err);
        });

        console.log("office: " + office);

        sessionRepo.create(session).then((result) => {
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
const gatheringRoutes = new SessionRouter();
gatheringRoutes.init();

export default gatheringRoutes.router;
