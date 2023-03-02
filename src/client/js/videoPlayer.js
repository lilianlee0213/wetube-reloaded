const video = document.querySelector('video');
const playBtn = document.getElementById('play');
const muteBtn = document.getElementById('mute');
const volumeRange = document.getElementById('volume');
const currentTime = document.getElementById('currentTime');
const totalTime = document.getElementById('totalTime');
const timeline = document.getElementById('timeline');
const fullScreenBtn = document.getElementById('fullScreen');
const videoContainer = document.getElementById('videoContainer');

let volumeValue = 0.5;
video.volume = volumeValue;
let videoStatus = false;

const handlePlay = () => {
	video.paused ? video.play() : video.pause();
	playBtn.innerText = video.paused ? 'Play' : 'Pause';
};

const handleMute = () => {
	video.muted = !video.muted;
	muteBtn.innerText = video.muted ? 'Unmute' : 'Mute';
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
const handleTimelineSet = (event) => {
	if (!videoStatus) {
		video.play();
	}
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
	const fullScreen = document.fullScreenElement;
	if (fullScreen) {
		document.exitFullscreen();
		fullScreenBtn.innerText = ' v';
	} else {
		videoContainer.requestFullscreen();
		fullScreenBtn.innerText = 'Exit Full Screen';
	}
};
window.addEventListener('keydown', handleSkip);
playBtn.addEventListener('click', handlePlay);
muteBtn.addEventListener('click', handleMute);
volumeRange.addEventListener('input', handleVolume);
video.addEventListener('loadedmetadata', handleLoadedMetaData);
video.addEventListener('timeupdate', handleTimeUpdate);
timeline.addEventListener('input', handleTimelineChange);
timeline.addEventListener('change', handleTimelineSet);
fullScreenBtn.addEventListener('click', handleFullScreen);
video.readyState
	? handleLoadedMetaData()
	: video.addEventListener('loadedmetadata', handleLoadedMetaData);
