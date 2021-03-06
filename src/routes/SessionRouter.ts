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


    newSession(req: Request & ParsedAsJson, res: Response, next: NextFunction){
        let sessionRepo = new SessionRepository();
        let officeRepo = new OfficeRepository();

        let session = new Session({
            day: req.body.day,
            start_time: req.body.start_time
        });

        sessionRepo.create(session).then((result) => {
            officeRepo.findById(req.body.officeId).then(
                (data) => {
                    data.sessions.push(result);
                    data.save();
                },
                err => err
            );
            res.json(result);
        }, err => {
            res.status(500).json(err);
        });
    };

    edit(req: Request & ParsedAsJson, res: Response, next: NextFunction){
        let sessionRepo = new SessionRepository();

        sessionRepo.findById(req.body.sessionId).then(
            (data) => {
                data.day = req.body.day;
                data.start_time = req.body.start_time;
                res.json(data.save());
            },
            err => err
        );
    }

    deleteSession(req: Request & ParsedAsJson, res: Response, next: NextFunction){
        let sessionRepo = new SessionRepository();

        sessionRepo.findById(req.body.sessionId).then(
            (data) => {
                sessionRepo.delete(data).then((result) => {
                    res.json("deleted");
                }, err => {
                    res.status(500).json(err);
                });
            },
            err => err
        );
    }

    /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
    init() {
        this.router.get('/', this.getAll);
        this.router.delete('/', this.deleteSession);
        this.router.post('/', this.newSession);
        this.router.patch('/', this.edit);

    }

}

// Create the TestRouter, and export its configured Express.Router
const gatheringRoutes = new SessionRouter();
gatheringRoutes.init();

export default gatheringRoutes.router;
