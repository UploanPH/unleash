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
const instanceId = `${process.env.UNLEASH_HOST}:${appPort}@${
    Math.floor(Math.random() * 10000000000)}`;
const statusPageUrl = `https://${process.env.UNLEASH_HOST}:${appPort}/info`;
const eureka = new Eureka({
    instance: {
        app: process.env.UNLEASH_APP_NAME,
        hostName: process.env.UNLEASH_HOST,
        instanceId: instanceId,
        ipAddr: '127.0.0.1',
        port: {
            '$': appPort,
            '@enabled': 'true',
        },
        vipAddress: instanceId,
        statusPageUrl: statusPageUrl,
        dataCenterInfo: {
            '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
            name: 'MyOwn',
        },
        registerWithEureka: process.env.EUREKA_REGISTER_WITH_EUREKA,
        fetchRegistry: process.env.EUREKA_FETCH_REGISTRY
    },
    eureka: {
        host: process.env.EUREKA_HOST,
        port: process.env.EUREKA_PORT,
        servicePath: process.env.EUREKA_SERVICE_PATH,
        preferIpAddress: process.env.EUREKA_PREFER_IP_ADDRESS
    }
});
eureka.logger.level('debug');
eureka.start(function (error) {
    console.log(error || 'registered to Uploan Discovery Service');
});