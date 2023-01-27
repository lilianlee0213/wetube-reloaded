import express from 'express';

const PORT = 4000;
const app = express();

const logger = (req, res, next) => {
	console.log(`${req.method},${req.url}`);
	next();
};
const privateMiddleWare = (req, res, next) => {
	const url = req.url;
	if (url === '/protected') {
		return res.send('<h1>Not Allowed</h1>');
	}
	console.log('allowed');
	next();
};
const handleHome = (req, res) => {
	return res.send('I love middlewares');
};
const handleProtected = (req, res) => {
	return res.send('welcome tpo the private lounge');
};
// const handleLogin = (req, res) => {
// 	return res.send('login');
// };
app.use(logger);
app.use(privateMiddleWare);
app.get('/', handleHome);
app.get('/protected', handleProtected);

app.listen(PORT, () =>
	console.log(`server is listening on port http://localhost:${PORT}`)
);
