const menu = document.querySelector('.menu');
const handleMenu = (e) => {
	const home = menu.querySelector('.menu-home');
	const videos = menu.querySelector('.menu-videos');
	const recentVideo = document.querySelector('.recentVideo');
	const title = document.querySelector('.user-videos h1');
	if (e.target === videos) {
		videos.classList.add('active');
		home.classList.remove('active');
		recentVideo.style.display = 'none';
		title.style.display = 'none';
	} else if (e.target === home) {
		home.classList.add('active');
		videos.classList.remove('active');
		recentVideo.style.display = 'flex';
		title.style.display = 'block';
	}
};
menu.addEventListener('click', handleMenu);
