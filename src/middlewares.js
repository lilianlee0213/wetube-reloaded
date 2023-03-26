import multer from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';

const s3 = new aws.S3({
	credentials: {
		accessKeyId: process.env.AWS_ID,
		secretAccessKey: process.env.AWS_SECRET,
	},
});
const multerUploader = multerS3({
	s3: s3,
	bucket: 'wetubeclone2023',
});
export const localsMiddleware = (req, res, next) => {
	res.locals.siteName = 'Wetube';
	res.locals.loggedIn = Boolean(req.session.loggedIn);
	res.locals.loggedInUser = req.session.user;
	res.locals.moment = require('moment');
	next();
};

export const protectorMiddleware = (req, res, next) => {
	if (req.session.loggedIn) {
		next();
	} else {
		req.flash('error', 'Log in first');
		return res.redirect('/login');
	}
};

export const publicOnlyMiddleware = (req, res, next) => {
	if (!req.session.loggedIn) {
		return next();
	} else {
		req.flash('error', 'Not authorized');
		return res.redirect('/');
	}
};
// use this middleware in our userRouter
export const avatarUpload = multer({
	dest: 'uploads/avatars',
	limits: {fileSize: 3000000},
	storage: multerUploader,
});
export const videoUpload = multer({
	dest: 'uploads/videos',
	limits: {fileSize: 100000000},
	storage: multerUploader,
});
