export const trending = (req, res) => {
	const videos = [
		{
			title: 'first Video',
			rating: 2,
			comments: 43,
			createdAt: '2 miniutes ago',
			views: 242,
		},
		{
			title: 'second Video',
			rating: 2,
			comments: 43,
			createdAt: '2 miniutes ago',
			views: 352,
		},
		{
			title: 'third Video',
			rating: 2,
			comments: 43,
			createdAt: '2 miniutes ago',
			views: 42,
		},
	];
	return res.render('home', {pageTitle: 'Home', videos});
};
export const see = (req, res) => res.render('watch', {pageTitle: 'Watch'});
export const edit = (req, res) => {
	return res.send('Edit');
};
export const deleteVideo = (req, res) => res.send('Delete Video');
export const upload = (req, res) => res.send('Upload Video');
