import express from 'express';
import morgan from 'morgan';
import session from 'express-session';
import flash from 'express-flash';
import Mongostore from 'connect-mongo';
import rootRouter from './routers/rootRouter';
import userRouter from './routers/userRouter';
import videoRouter from './routers/videoRouter';
import apiRouter from './routers/apiRouter';
import {localsMiddleware} from './middlewares';
const app = express();
const logger = morgan('dev');

app.set('view engine', 'pug');
app.set('views', process.cwd() + '/src/views');
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	// res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
});
app.use(logger);
// takes string and turns back to js object
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(
	session({
		secret: process.env.COOKIE_SECRET,
		resave: true,
		saveUninitialized: true,
		store: Mongostore.create({mongoUrl: process.env.DB_URL}),
	})
);
app.use(flash());
app.use(localsMiddleware);
app.use('/', rootRouter);
app.use('/uploads', express.static('uploads'));
app.use('/static', express.static('assets'));
// app.use('/images', express.static('images'));
app.use('/users', userRouter);
app.use('/videos', videoRouter);
app.use('/api', apiRouter);

export default app;
