'use strict';

let Sequelize = require('sequulize'),
	connection = new Sequelize('postgres://postgres:postgres@localhost:5432/postgres');

module.exports = connection;