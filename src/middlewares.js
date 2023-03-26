import multer from 'multer';
import multerS3 from 'multer-s3';
import {S3Client} from '@aws-sdk/client-s3';

const s3 = new S3Client({
	region: 'us-east-2',
	credentials: {
		accessKeyId: process.env.AWS_ID,
		secretAccessKey: process.env.AWS_SECRET,
	},
});
const svImageUloader = multerS3({
	s3: s3,
	bucket: 'wetubeclone2023',
	key: function (request, file, ab_callback) {
		const newFileName = Date.now() + '-' + file.originalname;
		const fullPath = 'images/' + newFileName;
		ab_callback(null, fullPath);
	},
	Condition: {
		StringEquals: {
			's3:x-amz-acl': ['public-read'],
		},
	},
});
const s3VideoUploader = multerS3({
	s3: s3,
	bucket: 'wetubeclone2023',
	key: function (request, file, ab_callback) {
		const newFileName = Date.now() + '-' + file.originalname;
		const fullPath = 'videos/' + newFileName;
		ab_callback(null, fullPath);
	},
	Condition: {
		StringEquals: {
			's3:x-amz-acl': ['public-read'],
		},
	},
});

const isHeroku = process.env.NODE_ENV === 'production';

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
		req.flash('error', 'Log in first.');
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
	storage: isHeroku ? svImageUloader : undefined,
});
export const videoUpload = multer({
	dest: 'uploads/videos',
	limits: {fileSize: 100000000},
	storage: isHeroku ? s3VideoUploader : undefined,
});
