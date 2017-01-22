/**
 * Created by jack on 1/21/17.
 */

import {Router, Request, Response, NextFunction} from 'express';
import {ParsedAsJson} from 'body-parser';
import OfficeRepository = require('../database/OfficeRepository');
import {Office} from "../models/Office";
import UserRepository = require("../database/UserRepository");
import * as fetch from 'isomorphic-fetch';
import {$$} from "../../../Q-Admin/node_modules/protractor/built/index";
import {User} from "../models/User";

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
        })
    };


    newOffice(req: Request & ParsedAsJson, res: Response, next: NextFunction) {
        let userRepo = new UserRepository();
        let officeRepo = new OfficeRepository();

        let office = new Office({
            name: req.body.name,
            location: req.body.location,
            description: req.body.description,
            user_id: {_id: req.body.userId, name: req.body.userName},
            active: false
        });

        officeRepo.create(office).then((result) => {
            userRepo.findById(req.body.userId).then(
                (data) => {
                    data.offices.push(result);
                    data.save();
                },
                err => err
            );
            res.json(result);
        }, err => {
            res.status(500).json(err);
        });
    };

    queue(req: Request & ParsedAsJson, res: Response, next: NextFunction) {
        let userId = req.body.userId;
        let userRepo = new UserRepository();
        let officeRepo = new OfficeRepository();

        let userObj;

        userRepo.findById(userId).then(
            (user) => {
                userObj = user;
                return officeRepo.findById(req.body.officeId)
            },
            err => err
        ).then(
            (office) => {
                let add = true;
                office.queue.forEach((item) => {
                    if (String(item._id) == String(userObj._id)) {
                        console.log('false');
                        add = false;
                    }
                });

                if (add) {
                    console.log('push');
                    office.queue.push(userObj);
                    office.miniQueue.push(userObj._id);
                    return office.save()
                }
            },
            err => err
        ).then(
            (success) => {
                if (success) {
                    let data = {user: userObj, officeId: req.body.officeId};

                    let headers = new Headers();

                    headers.append('Content-type', 'application/json');

                    fetch('http://qapp_web_socket_1:3333/', {
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers: headers
                    });

                    res.json(userId);
                }
            },
            err => res.status(500).json(err)
        );
    };

    unqueue(req: Request & ParsedAsJson, res: Response, next: NextFunction) {
        let officeRepo = new OfficeRepository();

        officeRepo.findById(req.body.officeId).then(
            (data) => {
                data.queue.shift();
                data.miniQueue.shift();
                res.json(data.save());
            },
            err => err
        );
    }

    edit(req: Request & ParsedAsJson, res: Response, next: NextFunction) {
        let officeRepo = new OfficeRepository();

        officeRepo.findById(req.body.officeId).then(
            (data) => {
                data.location = req.body.location;
                data.name = req.body.name;
                data.description = req.body.description;
                res.json(data.save());
            },
            err => err
        );

    }

    deleteOffice(req: Request & ParsedAsJson, res: Response, next: NextFunction) {
        let officeRepo = new OfficeRepository();

        officeRepo.findById(req.params.id).then(
            (data) => {
                officeRepo.delete(data).then((result) => {
                    res.json("deleted");
                }, err => {
                    console.log(err, req.body.officeId);
                    res.status(500).json(err);
                });
            },
            err => err
        );

    }

    leaveQueue(req: Request & ParsedAsJson, res: Response, next: NextFunction) {
        let officeRepo = new OfficeRepository();

        officeRepo.findById(req.body.officeId).then(
            (data) => {
                let i = data.queue.indexOf(req.body.userId);
                data.queue.splice(i, 1);
                data.miniQueue.splice(i, 1);
                data.save();

                data = {userId: req.body.userId, officeId: req.body.officeId};

                let headers = new Headers();

                headers.append('Content-type', 'application/json');

                fetch('http://qapp_web_socket_1:3333/', {
                    method: 'DELETE',
                    body: JSON.stringify(data),
                    headers: headers
                });


                res.json('deleted');
            },
            err => {
                res.status(500).json(err);
            },
        );
    }

    setActive(req: Request & ParsedAsJson, res: Response, next: NextFunction) {
        let officeRepo = new OfficeRepository();

        officeRepo.findById(req.body.officeId).then(
            (data) => {
                if (data.active == true) {
                    data.active = false;
                }
                else {
                    data.active = true;
                }
                res.json(data.save());
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
        this.router.delete('/:id', this.deleteOffice);
        this.router.post('/', this.newOffice);
        this.router.patch('/queue', this.queue);
        this.router.delete('/queue/pop', this.unqueue);
        this.router.patch('/', this.edit);
        this.router.delete('/queue/leave/', this.leaveQueue);
        this.router.patch('/active', this.setActive);
    }

}

// Create the TestRouter, and export its configured Express.Router
const gatheringRoutes = new OfficeRouter();
gatheringRoutes.init();

export default gatheringRoutes.router;
