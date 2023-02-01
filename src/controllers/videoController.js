export const trending = (req, res) => res.render('home', {pageTitle: 'Home'});
export const see = (req, res) => res.render('watch', {pageTitle: 'Watch'});
export const edit = (req, res) => {
	return res.send('Edit');
};
export const deleteVideo = (req, res) => res.send('Delete Video');
export const upload = (req, res) => res.send('Upload Video');
