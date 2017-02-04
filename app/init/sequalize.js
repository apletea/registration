'use strict';

let Sequelize = require('sequelize'),
	connection = new Sequelize('postgres://postgres:postgres@localhost:5432/postgres');

module.exports = connection;