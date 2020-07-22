'use strict';

const uploanAuth = require('./auth');
const { AuthenticationRequired } = require('../lib/server-impl.js');

const uploanLoginUrl = process.env.UPLOAN_LOGIN_URL
    ? process.env.UPLOAN_LOGIN_URL
    : 'https://localhost:3000/auth';

function uploanAuthHook(app) {
    app.use('/api/client', async (req, res, next) => {
        const isValidToken = await uploanAuth.isValidAuthToken(req);
        if (!isValidToken.result) {
            return res.status(401).send(isValidToken.data);
        }
        return next();
    });

    app.use('/api/admin/', async (req, res, next) => {
        const isValidToken = await uploanAuth.isValidAuthToken(req);
        if (!isValidToken.result) {
            return res
                .status('401')
                .json(
                    new AuthenticationRequired({
                        path: uploanLoginUrl,
                        type: 'uploan',
                        message:
                            'You have to identify yourself in order to use Unleash.',
                    }),
                )
                .end();
        }
        return next();
    });
}

module.exports = uploanAuthHook;
