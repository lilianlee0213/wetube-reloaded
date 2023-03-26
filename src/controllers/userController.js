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
	const user = await User.findOne({email, socialOnly: false});
	if (!user) {
		return res.status(400).render('login', {
			pageTitle,
			errorMessage: 'An account with this email does not exists.',
		});
	}
	const ok = await bcrypt.compare(password, user.password);
	if (!ok) {
		return res.status(400).render('login', {
			pageTitle,
			errorMessage: 'Wrong password.',
		});
	}
	req.session.loggedIn = true;
	req.session.user = user;
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
				socialOnly: true,
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
	req.flash('success', 'You have been successfully logged out.');
	req.session.user = null;
	res.locals.loggedInUser = req.session.user;
	req.session.loggedIn = false;
	return res.redirect('/');
};
export const getEdit = (req, res) => {
	return res.render('users/edit-profile', {pageTitle: 'Edit Profile'});
};
export const postEdit = async (req, res) => {
	const pageTitle = 'Edit Profile';
	const {
		session: {
			user: {_id, avatarUrl},
		},
		body: {firstName, lastName, username, email, location},
		file,
	} = req;

	let search = [];
	if (req.session.user.email !== email) {
		search.push({email});
	}
	if (req.session.user.username !== username) {
		search.push({username});
	}
	if (search.length > 0) {
		const existUser = await User.findOne({$or: search});
		if (existUser && existUser._id.toString() !== _id) {
			return res.status(404).render('users/edit-profile', {
				pageTitle,
				errorMessage: 'This username/email is already taken.',
			});
		}
	}

	const updatedUser = await User.findByIdAndUpdate(
		_id,
		{
			avatarUrl: file ? '/' + `${file.path}` : avatarUrl,
			firstName,
			lastName,
			username,
			email,
			location,
		},
		{new: true}
	);
	req.session.user = updatedUser;
	req.flash('success', 'Your profile has been updated.');
	return res.redirect(`/users/${_id}`);
};
export const getChangePassword = (req, res) => {
	// only allowed when socialOnly=false
	if (req.session.user.socialOnly === true) {
		req.flash('error', "Sorry, you don't have password to change.");
		return res.status(403).redirect('/');
	}
	return res.render('users/change-password', {pageTitle: 'Change Password'});
};
export const postChangePassword = async (req, res) => {
	const {
		// check who's loggedIn with _id
		session: {
			user: {_id},
		},
		// req value from the form
		body: {currentPassword, newPassword, newPasswordConfirmation},
	} = req;
	const user = await User.findById(_id);
	const ok = await bcrypt.compare(currentPassword, user.password);
	if (!ok) {
		return res.status(400).render('users/change-password', {
			pageTitle: 'Change Password',
			errorMessage: 'The current password is incorrect.',
		});
	}
	if (newPassword !== newPasswordConfirmation) {
		return res.status(400).render('users/change-password', {
			pageTitle: 'Change Password',
			errorMessage: 'The new password does not match the confirmation.',
		});
	}
	user.password = newPassword;
	await user.save();
	req.flash('success', 'Your password has been successfully updated.');
	return res.redirect('/users/edit');
};
export const see = async (req, res) => {
	const {id} = req.params;
	const user = await User.findById(id).populate({
		path: 'videos',
		populate: {
			path: 'creator',
			model: 'User',
		},
	});

	if (!user) {
		return res.status(404).render('404', {pageTitle: 'User Not Found'});
	}
	return res.render('users/profile', {
		pageTitle: `${user.username}'s Profile`,
		user,
		recentVideo: user.videos[user.videos.length - 1],
	});
};
