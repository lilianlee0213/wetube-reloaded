import express from 'express';
import {
	edit,
	see,
	logout,
	startGithibLogin,
	finishGithibLogin,
} from '../controllers/userController';

const userRouter = express.Router();

userRouter.get('/logout', logout);
userRouter.get('/edit', edit);
userRouter.get('/github/start', startGithibLogin);
userRouter.get('/github/finish', finishGithibLogin);
userRouter.get('/:id', see);

export default userRouter;
