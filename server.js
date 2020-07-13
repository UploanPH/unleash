'use strict';
require("dotenv").config();

const unleash = require('./lib/server-impl');
const uploanAuthHook = require('./uploan/uploan-auth-hook');

const databaseUrl = process.env.UNLEASH_DB_URL ? process.env.UNLEASH_DB_URL : 'postgres://root:root@localhost:5432/unleash';
const appPort = process.env.UNLEASH_APP_PORT ? process.env.UNLEASH_APP_PORT : 4242;


unleash
    .start({
        databaseUrl: databaseUrl,
        port: appPort,
        adminAuthentication: 'custom',
        preRouterHook: uploanAuthHook,
    })
    .then(unleash => {
        console.log(
            `Unleash started on http://localhost:${unleash.app.get('port')}`,
        );
    })
    .catch(err => {
        console.error(err);
    });