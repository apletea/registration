let express = require('express');

module.exports = (app, passport) => {
	let userRouter = require('./user')(express, passport);

	app.use ('/api/user', userRouter);
};