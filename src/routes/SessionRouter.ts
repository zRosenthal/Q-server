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


        /*sessionRepo.create(session).then(
            (res) => officeRepo.findById(req.body.office),
            (err) => err
        ).then(
            (data) => {
                data.sessions.push(result._id);
                return data.save();
            },
            (err) => err
        ).then(
            (success) => res.json(session),
            (err)  => res.status(500).json(err)

        );*/

        sessionRepo.create(session).then((result) => {
            officeRepo.findById(req.body.office).then(
                (data) => {
                    data.sessions.push(result._id);
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
const gatheringRoutes = new SessionRouter();
gatheringRoutes.init();

export default gatheringRoutes.router;
