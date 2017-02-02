let Model = require('../model');
let emailNotification = require('../utils/mailer');
module.exports = (express, passport) => {
	let router = express.Router();

	router.get('/getMe', passport.authenticate('jwt',{session: false}), (req,res) => {
		let user = req.user;
		res.status(200);
		return res.json(user);
	});

	router.post('/register', (req,res) => {
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



	return router;
}