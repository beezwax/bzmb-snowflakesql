const fetch = require('node-fetch');
const https = require('https');
const { access } = require('fs');

const auth = async (config = {}) => {
  const grantType = "refresh_token";
  const method = "POST";
  const httpsAgent = new https.Agent({
    rejectUnauthorized: !config.acceptUnauthorized,
  });
  const body = {
    grant_type: grantType,
    client_id: config.clientId,
    refresh_token: config.refreshToken,
    client_secret: config.clientSecret
  };
  const headers = {
    "Accept": "application/json",
	  "Content-type": "application/json"
  };
  const options = {
    method,
    headers,
    body: JSON.stringify(body),
    agent: httpsAgent
  };

  const response = await fetch(config.url, options);
  const json = await response.json();
  const access_token = json.access_token;
  if (!access_token) {
    throw new Error(JSON.stringify(json));
  }
  return access_token;
};

module.exports = auth;