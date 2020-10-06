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

const Eureka = require('eureka-js-client').Eureka;
const ip = require('ip');
const instanceId = `${process.env.UNLEASH_APP_NAME}:${process.env.UNLEASH_APP_PORT}@${Math.floor(Math.random() * 10000000000)}`;
const statusPageUrl = `http://${process.env.UNLEASH_HOST}:${process.env.UNLEASH_APP_PORT}/info`;
const eureka = new Eureka({
    instance: {
        app: process.env.UNLEASH_APP_NAME,
        hostName: process.env.UNLEASH_HOST,
        instanceId: instanceId,
        ipAddr: ip.address(),
        port: {
            '$': process.env.UNLEASH_APP_PORT,
            '@enabled': 'true',
        },
        status: 'UP',
        vipAddress: process.env.UNLEASH_APP_NAME,
        statusPageUrl: statusPageUrl,
        dataCenterInfo: {
            '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
            name: 'MyOwn',
        },
        registerWithEureka: (process.env.EUREKA_REGISTER_WITH_EUREKA == 'true'),
        fetchRegistry: (process.env.EUREKA_FETCH_REGISTRY == 'true')
    },
    eureka: {
        host: process.env.EUREKA_HOST,
        port: process.env.EUREKA_PORT,
        servicePath: process.env.EUREKA_SERVICE_PATH,
        preferIpAddress: (process.env.EUREKA_PREFER_IP_ADDRESS == 'true'),
        ssl: (process.env.EUREKA_SSL == 'true')
    }
});
eureka.logger.level('debug');
eureka.start(function (error) {
    console.log(error || 'registered to Uploan Discovery Service');
});