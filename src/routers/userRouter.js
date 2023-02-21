import express from 'express';
import {
	getEdit,
	postEdit,
	see,
	logout,
	startGithibLogin,
	finishGithibLogin,
	getChangePassword,
	postChangePasswrod,
} from '../controllers/userController';
import {
	protectorMiddleware,
	publicOnlyMiddleware,
	uploadFiles,
} from '../middlewares';

const userRouter = express.Router();

// only allows when user is loggedIn
userRouter.get('/logout', protectorMiddleware, logout);
userRouter
	.route('/edit')
	.all(protectorMiddleware)
	.get(getEdit)
	.post(uploadFiles.single('avatar'), postEdit);
userRouter
	.route('/change-password')
	.all(protectorMiddleware)
	.get(getChangePassword)
	.post(postChangePasswrod);
// only allows when user is loggedOut
userRouter.get('/github/start', publicOnlyMiddleware, startGithibLogin);
userRouter.get('/github/finish', publicOnlyMiddleware, finishGithibLogin);

userRouter.get('/:id', see);

export default userRouter;
