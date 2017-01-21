/**
 * Created by zacharyrosenthal on 11/18/16.
 */

import {Router, Request, Response, NextFunction} from 'express';
import {ParsedAsText} from 'body-parser';
import AuthService = require('../services/AuthService');
import UserRepository = require('../database/UserRepository');
import {User} from '../models/User';
import IUser = require('../modelInterfaces/IUser');
import FacebookAuthProvider = require('../services/authProviders/facebookAuthProvider');

export class LoginRouter {
    router: Router;

    /**
     * Initialize the Router
     */
    constructor() {
        this.router = Router();
        this.init();
    }

    /**
     * GET all Resources
     */
    getAll(req: Request & ParsedAsText, res: Response, next: NextFunction) {

        let userRepository = new UserRepository();

        let action = 'register'; // body['action'];
        let actionType = 'fb'; // body['actionType'];
        let token = req.params.token;

        console.log('token: ' + token);

        if (action === 'login') {

        }
        else if (action === 'register') {

            // Build user object based on platform
            if (actionType === 'fb') {

                let fb = new FacebookAuthProvider();
                fb.registerUser(token).then(response => {
                        console.log(JSON.stringify(response));
                        let user = new User({
                            name: response.first_name + ' ' + response.last_name,
                            provider: 'fb',
                            id: response.id,
                            email: response.email,
                            // optional if you want user photo, must update model as well
                            picture_url: response['picture'].data.url
                        });

                        userRepository.create(user).then((entity) => {

                            console.log(`response: ${JSON.stringify(entity)}`);
                            let token = AuthService.createAuthToken(entity['_doc']);
                            console.log('token: ' + token);
                            res.json(token);
                        }, err => {

                            console.log(`err: ${JSON.stringify(err)}`);
                        });

                        /*userRepository.findOrCreate({id: response.id}).then((entity) => {

                            console.log(`response: ${JSON.stringify(entity)}`);
                            let token = AuthService.createAuthToken(entity['_doc']);
                            res.json(token);
                        }, err => {

                            console.log(`err: ${JSON.stringify(err)}`);
                        });*/
                        // console.log(JSON.stringify(res, null, 2));
                    },
                    error => error);

            }
            else if (actionType === 'google') {


            }

            // Repository('User').Save({id: 'asdfasdf', provider: 'fb'});
            // User.findOrCreate(<IUser>{id: 'asdfasdf', provider: 'fb'}).then((user) => {
            //    let token = AuthService.createAuthToken(user);
            //    res.json({user: user, token: token});
            // });
        }
    }

    /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
    init() {
        this.router.get('/:token', this.getAll);
    }

}

// Create the TestRouter, and export its configured Express.Router
const testRoutes = new LoginRouter();
testRoutes.init();

export default testRoutes.router;
