'use strict';

const actuator = require('express-actuator');
const uploanAuth = require('./auth');
const User = require('../lib/user');
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
        const adminDetails = isValidToken.data;
        req.user = new User({ username: adminDetails.user_name || adminDetails.client_id });
        return next();
    });

    app.use(actuator());
}

module.exports = uploanAuthHook;
