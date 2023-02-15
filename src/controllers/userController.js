import User from '../models/User';
import bcrypt from 'bcrypt';

export const getJoin = (req, res) => res.render('join', {pageTitle: 'Join'});
export const postJoin = async (req, res) => {
	const {firstName, lastName, username, email, password, password2, location} =
		req.body;
	const pageTitle = 'join';
	if (password !== password2) {
		return res.status(400).render('join', {
			pageTitle,
			errorMessage: 'Password confirmation does not match.',
		});
	}
	const exists = await User.exists({$or: [{username}, {email}]});
	if (exists) {
		return res.status(400).render('join', {
			pageTitle,
			errorMessage: 'This username/email is already taken.',
		});
	}
	try {
		await User.create({
			firstName,
			lastName,
			username,
			email,
			password,
			password2,
			location,
		});
		return res.redirect('/login');
	} catch (error) {
		return res.status(400).render('join', {
			pageTitle: `Join`,
			errorMessage: error._message,
		});
	}
};
export const getLogin = (req, res) => {
	return res.render('login', {pageTitle: 'Login'});
};
export const postLogin = async (req, res) => {
	const {email, password} = req.body;
	const pageTitle = 'Login';
	const user = await User.findOne({email, socialCreated: false});
	if (!user) {
		return res.status(400).render('login', {
			pageTitle,
			errorMessage: 'An account with this username does not exists.',
		});
	}
	const ok = bcrypt.compare(password, user.password);
	if (!ok) {
		return res.status(400).render('login', {
			pageTitle,
			errorMessage: 'Wrong password.',
		});
	}
	req.session.loggedIn = true;
	req.session.user = user;
	// console.log(req.session.user);
	return res.redirect('/');
};
export const startGithibLogin = (req, res) => {
	const baseUrl = 'https://github.com/login/oauth/authorize';
	const config = {
		client_id: process.env.GH_CLIENT,
		allow_signup: false,
		scope: 'read:user user:email',
	};
	const params = new URLSearchParams(config).toString();
	const finalUrl = `${baseUrl}?${params}`;
	return res.redirect(finalUrl);
};
export const finishGithibLogin = async (req, res) => {
	const baseUrl = 'https://github.com/login/oauth/access_token';
	const config = {
		client_id: process.env.GH_CLIENT,
		client_secret: process.env.GH_SECRET,
		code: req.query.code,
	};
	const params = new URLSearchParams(config).toString();
	const finalUrl = `${baseUrl}?${params}`;
	const tokenRequest = await (
		await fetch(finalUrl, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
			},
		})
	).json();
	if ('access_token' in tokenRequest) {
		// access API
		const {access_token} = tokenRequest;
		const apiUrl = 'https://api.github.com';
		const userData = await (
			await fetch(`${apiUrl}/user`, {
				headers: {
					Authorization: `token ${access_token}`,
				},
			})
		).json();
		// console.log(userData.name.split('').slice(0, -1));
		const emailData = await (
			await fetch(`${apiUrl}/user/emails`, {
				headers: {
					Authorization: `token ${access_token}`,
				},
			})
		).json();
		const emailObj = emailData.find(
			(email) => email.primary === true && email.verified === true
		);

		if (!emailObj) {
			return res.redirect('/login');
		}
		let socialUser = await User.findOne({email: emailObj.email});
		if (!socialUser) {
			//creating a user with the data from Github without password, and setting social only true
			socialUser = await User.create({
				avatarUrl: userData.avatar_url,
				firstName: userData.name.split(' ')[0],
				lastName: userData.name.split(' ')[1],
				username: userData.login,
				socialCreated: true,
				email: emailObj.email,
				password: '',
				location: userData.location,
			});
		} else {
			req.session.loggedIn = true;
			req.session.user = socialUser;
			return res.redirect('/');
		}
	} else {
		return res.redirect('/login');
	}
};

export const logout = (req, res) => {
	req.session.destroy();
	return res.redirect('/');
};
export const see = (req, res) => res.send('See users');
export const edit = (req, res) => res.send('Edit users');
