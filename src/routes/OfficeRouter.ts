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


    newOffice(req: Request & ParsedAsJson, res: Response, next: NextFunction){
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

    queue(req: Request & ParsedAsJson, res: Response, next: NextFunction){
        let userId = req.body.userId;
        let userRepo = new UserRepository();
        let officeRepo = new OfficeRepository();

        var user;

        userRepo.findById(userId).then(
            (data) => {
                user = data;
            },
            err => err
        );

        officeRepo.findById(req.body.officeId).then(
            (data) => {
                data.queue.push({_id: userId, name: user.name});
                console.log("userId: " + userId);
                data.save();

                res.json(userId);
            },
            err => err
        );
    };

    unqueue(req: Request & ParsedAsJson, res: Response, next: NextFunction){
        let officeRepo = new OfficeRepository();

        officeRepo.findById(req.body.officeId).then(
            (data) => {
                data.queue.shift();
                res.json(data.save());
            },
            err => err
        );
    }

    edit(req: Request & ParsedAsJson, res: Response, next: NextFunction){
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

    deleteOffice(req: Request & ParsedAsJson, res: Response, next: NextFunction){
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

    leaveQueue(req: Request & ParsedAsJson, res: Response, next: NextFunction){
        let officeRepo = new OfficeRepository();

        officeRepo.findById(req.body.officeId).then(
            (data) => {
                console.log('data:' + data);
                let i = data.queue.indexOf(req.body.userId);
                console.log('i:' + i);
                console.log('userId:' + req.body.userId);
                data.queue.splice(i, 1);
                data.save();

                /*for(let i = 0; i < data.queue.length; i++){
                    console.log('Here2' + data.queue.length);
                    if(data.queue[i] == req.params.id){
                        console.log('Here3');
                        data.queue.splice(i, 1);
                    }
                }*/
                res.json('deleted');
            },
            err => {
                res.status(500).json(err);
            },
        );
    }

    setActive(req: Request & ParsedAsJson, res: Response, next: NextFunction){
        let officeRepo = new OfficeRepository();

        officeRepo.findById(req.body.officeId).then(
            (data) => {
                if(data.active == true){
                    data.active = false;
                }
                else{
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
