import express from 'express';

const PORT = 4000;
const app = express();

const handleHome = (req, res) => {
	return res.send('I love you');
};
const handleLogin = (req, res) => {
	return res.send('login');
};
app.get('/', handleHome);
app.get('/login', handleLogin);

app.listen(PORT, () =>
	console.log(`server is listening on port http://localhost:${PORT}`)
);
