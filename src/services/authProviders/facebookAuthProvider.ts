import requestPromise = require('request-promise');

interface IAccessToken {

    access_token: string;
    token_type: string;
    expires_in: number;
}

class FacebookAuthProvider {

    static CLIENT_ID = '1123588731087524';
    static REDIRECT_URI = 'http://localhost/callback';;
    static CLIENT_SECRET = '6560e59bce9e899d07bd891d180c6806';
    static URI = 'https://graph.facebook.com/v2.8/';

    public registerUser(code: string): any {
        return new Promise<any>((resolve, reject) => {
            FacebookAuthProvider.getRegisterData(code)
                .then(
                    res => resolve(res),
                    error => reject(error)
                );
        });
    }

    private static getRegisterData(token: string): Promise<Object> {
        let options = {
            uri: `${FacebookAuthProvider.URI}me`,
            qs: {
                access_token: token,
                fields: 'name,picture,email'
            },
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true // Automatically parses the JSON string in the response
        };


        return requestPromise(options).then(
            res => res,
            error => error
        );
    }


}

export = FacebookAuthProvider;
