import express from 'express';
import {
	getEdit,
	postEdit,
	see,
	logout,
	startGithibLogin,
	finishGithibLogin,
} from '../controllers/userController';
import {protectorMiddleware, publicOnlyMiddleware} from '../middlewares';

const userRouter = express.Router();

// only allows when user is loggedIn
userRouter.get('/logout', protectorMiddleware, logout);
userRouter.route('/edit').all(protectorMiddleware).get(getEdit).post(postEdit);
// only allows when user is loggedOut
userRouter.get('/github/start', publicOnlyMiddleware, startGithibLogin);
userRouter.get('/github/finish', publicOnlyMiddleware, finishGithibLogin);

userRouter.get('/:id', see);

export default userRouter;
