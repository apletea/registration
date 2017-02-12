'use strict';

let Sequelize = require('sequelize');
let hooks = require('./hooks');

let attributes = {
	id: {
		allowNull: false,
		autoIncrement: true,
		primaryKey: true,
		type: Sequelize.BIGINT
	},
	email: {
		type: Sequelize.STRING,
		unique: true,
		validate: {
			isEmail: true
		}
	},
	password: Sequelize.STRING,
	token: Sequelize.STRING,
	is_confirm: {
		type: Sequelize.BOOLEAN,
		defaultValue: false
	}
};

let options = {
	hooks: hooks,
	freezeTableName: true,
    timestamps: false,
    instanceMethods: {
    	getFullInfo: function() {
    		let self = this;

    		let jsonResult = JSON.parse(JSON.stringify(self.get()));
    		return new Promise((resolve,reject) => {
    			resolve(jsonResult);
    		})
    	}
    }
};

module.exports.attributes = attributes;
module.exports.options = options;