let videos = [
	{
		title: 'first Video',
		rating: 2,
		comments: 43,
		createdAt: '2 miniutes ago',
		views: 1,
		id: 1,
	},
	{
		title: 'second Video',
		rating: 2,
		comments: 43,
		createdAt: '2 miniutes ago',
		views: 352,
		id: 2,
	},
	{
		title: 'third Video',
		rating: 2,
		comments: 43,
		createdAt: '2 miniutes ago',
		views: 42,
		id: 3,
	},
];
export const trending = (req, res) =>
	res.render('home', {pageTitle: 'Home', videos});
export const watch = (req, res) => {
	const {id} = req.params;
	const video = videos[id - 1];
	res.render('watch', {pageTitle: `Watching ${video.title}`, video});
};
export const getEdit = (req, res) => {
	const {id} = req.params;
	const video = videos[id - 1];
	return res.render('edit', {pageTitle: `Editing ${video.title}`, video});
};
export const postEdit = (req, res) => {
	const {id} = req.params;
	const {title} = req.body;
	// update video's title from req.body
	videos[id - 1].title = title;
	return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) =>
	res.render('upload', {pageTitle: `Upload a new Video`});
export const postUpload = (req, res) => {
	const {title} = req.body;
	const newVideo = {
		title,
		rating: 0,
		comments: 0,
		createdAt: 'Just Now',
		views: 0,
		id: videos.length - 1,
	};
	videos.push(newVideo);
	return res.redirect('/');
};
