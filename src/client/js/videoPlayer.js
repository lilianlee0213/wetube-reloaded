const video = document.getElementById('video');
const playBtn = document.getElementById('play');
const playIcon = playBtn.querySelector('i');
const muteBtn = document.getElementById('mute');
const muteIcon = muteBtn.querySelector('i');
const volumeRange = document.getElementById('volume');
const currentTime = document.getElementById('currentTime');
const totalTime = document.getElementById('totalTime');
const timeline = document.getElementById('timeline');
const fullScreenBtn = document.getElementById('fullScreen');
const fullScreenIcon = fullScreenBtn.querySelector('i');
const videoContainer = document.getElementById('videoContainer');
const videoControls = document.getElementById('videoControls');
const likeBtn = document.getElementById('likeBtn');

// let isFocused = false;
let videoStatus = false;
let controlsTimeout = null;
let controlsMovementTimeout = null;
let volumeValue = 0.5;
video.volume = volumeValue;
let isLiked = false;

const handleRangeStyle = (range, color1, color2) => {
	const varPercent = (range.value / range.max) * 100;
	range.style.background = `linear-gradient(90deg, ${color1} 0%, ${color1} ${varPercent}%, ${color2} ${varPercent}%, ${color2} 100%)`;
};

const handleKeyCode = (event) => {
	const code = event.code;
	if (event.target.id !== 'textarea') {
		if (code == 'Space') {
			event.preventDefault();
			handlePlay();
			videoControls.classList.add('showing');
		}
		if (code === 'ArrowRight') {
			video.currentTime += 5;
			videoControls.classList.add('showing');
			setTimeout(hideControls, 3000);
		}
		if (code == 'ArrowLeft') {
			video.currentTime -= 5;
			videoControls.classList.add('showing');
			setTimeout(hideControls, 3000);
		}
	}

	// event.preventDefault();
};
const handlePlay = () => {
	video.paused ? video.play() : video.pause();
	playIcon.classList = video.paused ? 'fa-solid fa-play' : 'fa-solid fa-pause';
};

const handleMute = () => {
	video.muted = !video.muted;
	muteIcon.classList = video.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
	volumeRange.value = video.muted ? 0 : volumeValue;
	if (video.muted) {
		volumeRange.style.background =
			'linear-gradient(90deg, rgba(255, 255, 255,1) 0%, rgba(255, 255, 255,1) 0%, rgba(152, 148, 144,1) 0%, rgba(152, 148, 144,1) 100%)';
	} else {
		handleRangeStyle(
			volumeRange,
			'rgba(255, 255, 255, 1)',
			'rgba(152, 148, 144, 1)'
		);
	}
};
const handleVolume = (event) => {
	const {
		target: {value},
	} = event;
	video.volume = value;
	if (video.volume === 0) {
		video.muted = true;
		muteIcon.classList = 'fas fa-volume-mute';
	} else {
		video.muted = false;
		muteIcon.classList = 'fas fa-volume-up';
	}
};
const handleVolumeSet = (event) => {
	const {
		target: {value},
	} = event;
	volumeValue = value;
	// const varPercent = (volumeRange.value / volumeRange.max) * 100;
	handleRangeStyle(
		volumeRange,
		'rgba(255, 255, 255, 1)',
		'rgba(152, 148, 144, 1)'
	);
};
const formatTime = (seconds) => {
	const startIdx = seconds > 3600 ? 11 : 14;
	return new Date(seconds * 1000).toISOString().slice(startIdx, 19);
};
const handleLoadedMetaData = () => {
	totalTime.innerText = formatTime(Math.floor(video.duration));
	timeline.max = Math.floor(video.duration);
};
const handleTimeUpdate = () => {
	currentTime.innerText = formatTime(Math.floor(video.currentTime));
	timeline.value = Math.floor(video.currentTime);
};

const handleTimelineStyle = () => {
	handleRangeStyle(timeline, 'rgba(255,0,0,1)', 'rgba(83,83,83,0.4)');
};

const handleTimelineChange = (event) => {
	const {
		target: {value},
	} = event;
	video.currentTime = value;
	if (!videoStatus) {
		video.pause();
	}
};

const handleTimelineSet = () => {
	if (!videoStatus) {
		video.play();
	}
};

const handleVideoEnded = () => {
	const {id} = videoContainer.dataset;
	fetch(`/api/videos/${id}/view`, {method: 'POST'});
};

const handleFullScreen = () => {
	document.fullscreenElement
		? document.exitFullscreen()
		: videoContainer.requestFullscreen();
};

const handleFullScreenBtn = () => {
	document.fullscreenElement
		? (fullScreenIcon.classList = 'fas fa-compress')
		: (fullScreenIcon.classList = 'fas fa-expand');
};
const hideControls = () => {
	videoControls.classList.remove('showing');
};
const handleMouseMove = () => {
	if (controlsTimeout) {
		clearTimeout(controlsTimeout);
		controlsTimeout = null;
	}
	if (controlsMovementTimeout) {
		clearTimeout(controlsMovementTimeout);
		controlsMovementTimeout = null;
	}
	controlsMovementTimeout = setTimeout(hideControls, 3000);
	videoControls.classList.add('showing');
};
const handleMouseLeave = () => {
	controlsTimeout = setTimeout(hideControls, 3000);
};
const handleLikeBtn = () => {
	const {id} = videoContainer.dataset;
	fetch(`/api/videos/${id}/rating`, {method: 'POST'});
	likeBtn.firstChild.style.color = '#065fd4';
};
// const handleUnlikeBtn = () => {
// 	const {id} = videoContainer.dataset;
// 	fetch(`/api/videos/${id}/rating-unlike`, {method: 'POST'});
// 	likeBtn.firstChild.style.color = 'black';
// 	likeBtn.removeEventListener('click', handleUnlikeBtn);
// 	likeBtn.addEventListener('click', handleLikeBtn);
// };

window.addEventListener('keydown', handleKeyCode);
playBtn.addEventListener('click', handlePlay);
video.addEventListener('click', handlePlay);
muteBtn.addEventListener('click', handleMute);
volumeRange.addEventListener('input', handleVolume);
volumeRange.addEventListener('change', handleVolumeSet);
video.addEventListener('loadedmetadata', handleLoadedMetaData);
video.addEventListener('timeupdate', handleTimeUpdate);
video.addEventListener('timeupdate', handleTimelineStyle);
timeline.addEventListener('input', handleTimelineChange);
timeline.addEventListener('change', handleTimelineSet);
video.addEventListener('ended', handleVideoEnded);
fullScreenBtn.addEventListener('click', handleFullScreen);
videoContainer.addEventListener('fullscreenchange', handleFullScreenBtn);
videoContainer.addEventListener('mousemove', handleMouseMove);
videoContainer.addEventListener('mouseleave', handleMouseLeave);
video.readyState
	? handleLoadedMetaData()
	: video.addEventListener('loadedmetadata', handleLoadedMetaData);
likeBtn.addEventListener('click', handleLikeBtn);
