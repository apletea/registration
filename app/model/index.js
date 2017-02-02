'use strict';

let UserMeta = require('./User');

let connection = require('../init/sequalize');

let User = connection.define('user_token', UserMeta.attributes, UserMeta.options);

module.exports = User;

