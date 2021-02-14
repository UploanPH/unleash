'use strict';

const axios = require("axios");
const { response } = require("express");

const uploanAuthUrl = process.env.UPLOAN_AUTH_URL ? process.env.UPLOAN_AUTH_URL : 'https://localhost:3000/auth';

const validateToken = async (oauthToken) => {
    try {
        let config = {
            headers: { 'Authorization': `Bearer ${oauthToken}` }
        }
        return await axios.post(`${uploanAuthUrl}/oauth/check_token/?token=${oauthToken}`, {}, config)
    } catch (err) {
        console.error(err.response)
        return err.response;
    }
}
const isValidAuthToken = async (request) => {
    try {
        const authHeader = request.header('authorization') ? request.header('authorization') : '';
        const hasTokenBearer = authHeader.toUpperCase().startsWith("BEARER");
        if (!(authHeader && hasTokenBearer)) {
            return false;
        }
        const validateTokenRequest = await validateToken(authHeader.slice(7));
        return {
            result: validateTokenRequest.status === 200,
            data: validateTokenRequest.data,
        }
    } catch (err) {
        console.error(err)
    }

};

module.exports = { isValidAuthToken }