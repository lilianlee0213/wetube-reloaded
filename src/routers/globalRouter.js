import express from 'express';
import {join, login, search} from '../controllers/userController';
import {trending} from '../controllers/videoController';

const globalRouter = express.Router();

globalRouter.get('/', trending);
globalRouter.get('/join', join);
globalRouter.get('/login', login);

export default globalRouter;
