let Model = require('../model');
let emailNotification = require('../utils/mailer');
let errorUtil = require('../utils/errors');
let responseUtil = require('../utils/response');
let authHelper = require('../utils/auth');

module.exports = (express, passport) => {
	let router = express.Router();

	router.get('/getMe', passport.authenticate('jwt',{session: false}), (req,res) => {
		let user = req.user;
		res.status(200);
		return res.json(user);
	});

	router.post('/register', (req,res) => {
		console.log(req.body);
		Model.findOne({
			where: {
				email: req.body.email.trim().toLowerCase()
			}
		})
			.then(user => {
				if (user) {
					res.status(400);
					return res.json('User with such email already exsist');
				}

				Model.create({email: req.body.email, password: req.body.password})
					.then(newUser => {
						emailNotification("Please confirm your registration by the following this link: localhost:8080/api/user/confirm?token="+newUser.token, newUser.email);
						res.status(200);
						return res.json('Confirm your email');
					})
			})
			.catch(err => {
				res.status(500);
				return res.json(err);
			})
	});

	router.get('/confirm', (req,res) => {
		let userToken = req.query.token;
		Model.findOne({
			where: {
				token: userToken
			}
		})
			.then(user => {
				user.update({is_confirm: true})
					.then(() => {
						res.status(200);
						return res.json('Email confirmed');
					})
			})
			.catch(err => {
				res.status(500);
				return res.json(err);
			})
	});

	router.get('/login', (req,res) => {
		let email = req.query.email;
		let password = req.query.password;

		let errorObject = errorUtil.checkRequiredParams(req,['email','password'], errorUtil.errorCodes.ERR_USER_LOGIN_FAIL);

		if (errorObject) {
			res.status(400);
			return res.json(errorObject);
		}

		Model.findOne({where: {
			email: email.trim().toLowerCase(),
			is_confirm: true
		}})
		.then(result => {
			if (!result){
				res.status(403);
				return res.json(responseUtil.getErrorResponseJsonObject(errorUtil.errorCodes.ERR_USER_LOGIN_FAIL,'Invalid login or password'));
			}

			let user = result.get();

			authHelper.comparePassword(password, user.password, (err, isMatch) => {
				if (isMatch && !err){
					if (!result.get().token.startsWith('JWT')){
						result.token = authHelper.getJwtToken({
							id: result.id,
							email: result.email,
							password: result.password
						});
					}

					result.save()
						.then(result => {
							res.status(200);
							result.getFullInfo()
								.then(content => {
									return res.json(content);
								})
						})
				}
				else {
					res.status(403);
					return res.json(responseUtil.getErrorResponseJsonObject(errorUtil.errorCodes.ERR_USER_LOGIN_FAIL, 'Invalid login or Password'));			}
			})
		})
	});



	return router;
}