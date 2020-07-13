'use strict';

const uploanAuth = require('./auth');
const { AuthenticationRequired } = require('../lib/server-impl.js');

function uploanAuthHook(app) {
    app.use('/api/client', async (req, res, next) => {
        const isValidToken = await uploanAuth.isValidAuthToken(req)
        if (!isValidToken.result) {
            return res.status(401).send(isValidToken.data);
        }

        return next();
    });

    app.use('/api/admin/', async (req, res, next) => {
        const isValidToken = await uploanAuth.isValidAuthToken(req)
        if (!isValidToken.result) {
            return res
                .status('401')
                .json(
                    new AuthenticationRequired({
                        path: 'https://gw.dev.uploan.ph/api/v1/login',
                        type: 'uploan',
                        message:
                            'You have to indentify yourself in order to use Unleash.',
                    }),
                )
                .end();
        } else {
            return next();
        }
    });
}

module.exports = uploanAuthHook;