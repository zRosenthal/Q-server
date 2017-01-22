

import {Router, Request, Response, NextFunction} from 'express';
import {ParsedAsText, ParsedAsJson} from 'body-parser';
import {IUser} from '../modelInterfaces/IUser';
import UserRepository = require('../database/UserRepository');
import {User} from "../models/User";

export class UserRouter {
    router: Router;

    /**
     * Initialize the Router
     */
    constructor() {
        this.router = Router();
        this.init();
    }

    getAll(req: Request & ParsedAsJson, res: Response, next: NextFunction) {
        let userRepo = new UserRepository();

        userRepo.findAll({}, null).then((result) => {
            res.json(result);
        }, err => {
            res.status(500).json(err);
        });
    };

    deleteAll(req: Request & ParsedAsJson, res: Response, next: NextFunction) {
        let userRepo = new UserRepository();
        userRepo.removeAll().then((result) => {
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

        let user = new User(req.body);

        userRepo.create(user).then((result) => {
            res.json(result);
        }, err => {
            res.status(500).json(err);
        });
    };

    edit(req: Request & ParsedAsJson, res: Response, next: NextFunction){
        let userRepo = new UserRepository();

        userRepo.findById(req.body.userId).then(
            (data) => {
                data.name = req.body.name;
                data.email = req.body.email;
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
        this.router.delete('/', this.deleteAll);
        this.router.post('/', this.new);
        this.router.patch('/', this.edit);
    }

}

// Create the TestRouter, and export its configured Express.Router
const gatheringRoutes = new UserRouter();
gatheringRoutes.init();

export default gatheringRoutes.router;
