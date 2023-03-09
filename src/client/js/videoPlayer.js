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

let videoStatus = false;
let controlsTimeout = null;
let controlsMovementTimeout = null;
let volumeValue = 0.5;
video.volume = volumeValue;

const handlePlay = () => {
	video.paused ? video.play() : video.pause();
	playIcon.classList = video.paused ? 'fa-solid fa-play' : 'fa-solid fa-pause';
};

const handleMute = () => {
	video.muted = !video.muted;
	muteIcon.classList = video.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
	volumeRange.value = video.muted ? 0 : volumeValue;
};
const handleVolume = (event) => {
	const {
		target: {value},
	} = event;
	if (video.muted) {
		video.muted = false;
		muteBtn.innerText = 'Mute';
	}
	volumeValue = value;
	video.volume = value;
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
const handleTimelineStyle = () => {
	const varPercent = (timeline.value / timeline.max) * 100;
	timeline.style.background = `linear-gradient(90deg, rgba(255,0,0,1) 0%, rgba(255,0,0,1) ${varPercent}%, rgba(83,83,83,1) ${varPercent}%, rgba(83,83,83,1) 100%)`;
};

const handleVideoEnded = () => {
	const {id} = videoContainer.dataset;
	fetch(`/api/videos/${id}/view`, {method: 'POST'});
};
const handleSkip = (event) => {
	event.preventDefault();
	if (event.keyCode == 39) {
		video.currentTime += 5;
	}
	if (event.keyCode == 37) {
		video.currentTime -= 5;
	}
};
const handleFullScreen = () => {
	document.fullscreenElement
		? document.exitFullscreen()
		: videoContainer.requestFullscreen();
};
//
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
window.addEventListener('keydown', handleSkip);
playBtn.addEventListener('click', handlePlay);
muteBtn.addEventListener('click', handleMute);
volumeRange.addEventListener('input', handleVolume);
video.addEventListener('loadedmetadata', handleLoadedMetaData);
video.addEventListener('timeupdate', handleTimeUpdate);
timeline.addEventListener('input', handleTimelineChange);
timeline.addEventListener('change', handleTimelineSet);
video.addEventListener('timeupdate', handleTimelineStyle);
video.addEventListener('ended', handleVideoEnded);
fullScreenBtn.addEventListener('click', handleFullScreen);
videoContainer.addEventListener('fullscreenchange', handleFullScreenBtn);
videoContainer.addEventListener('mousemove', handleMouseMove);
videoContainer.addEventListener('mouseleave', handleMouseLeave);
video.readyState
	? handleLoadedMetaData()
	: video.addEventListener('loadedmetadata', handleLoadedMetaData);
