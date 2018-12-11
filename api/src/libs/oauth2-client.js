const { OAuth2Client } = require('google-auth-library');

module.exports = ({ parameters }) => new OAuth2Client(parameters.auth.clientId);
