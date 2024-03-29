import {createFFmpeg, fetchFile} from '@ffmpeg/ffmpeg';
const recordBtn = document.getElementById('startBtn');
const video = document.getElementById('preview');

let stream;
let recorder;
let videoFile;

const files = {
	input: 'recording.webm',
	output: 'output.mp4',
	thumb: 'thumbnail.jpg',
};
const downloadFile = (fileUrl, fileName) => {
	const a = document.createElement('a');
	a.href = fileUrl;
	a.download = fileName;
	document.body.appendChild(a);
	a.click();
};
const handleDownload = async () => {
	recordBtn.removeEventListener('click', handleDownload);
	recordBtn.innerText = 'transcoding...';
	recordBtn.classList.remove('download');
	recordBtn.classList.add('transcode');
	recordBtn.disabled = true;

	const ffmpeg = createFFmpeg({log: true});
	await ffmpeg.load();
	ffmpeg.FS('writeFile', files.input, await fetchFile(videoFile));
	await ffmpeg.run('-i', files.input, '-r', '60', files.output);
	await ffmpeg.run(
		'-i',
		files.input,
		'-ss',
		'00:00:01',
		'-frames:v',
		'1',
		files.thumb
	);

	const mp4File = ffmpeg.FS('readFile', files.output);
	const thumbFile = ffmpeg.FS('readFile', files.thumb);

	const mp4Blob = new Blob([mp4File.buffer], {type: 'video/mp4'});
	const thumbBlob = new Blob([thumbFile.buffer], {type: 'image/jpg'});

	const mp4Url = URL.createObjectURL(mp4Blob);
	const thumbUrl = URL.createObjectURL(thumbBlob);

	downloadFile(mp4Url, 'MyRecording.mp4');
	downloadFile(thumbUrl, 'MyThumbnail.jpg.');

	// remove from memory
	ffmpeg.FS('unlink', files.input);
	ffmpeg.FS('unlink', files.output);
	ffmpeg.FS('unlink', files.thumb);

	URL.revokeObjectURL(mp4Url);
	URL.revokeObjectURL(thumbUrl);
	URL.revokeObjectURL(videoFile);

	// reset
	recordBtn.disabled = false;
	recordBtn.innerText = 'Record Again';
	recordBtn.classList.remove('transcode');

	recordBtn.addEventListener('click', handleStart);
};
const handleStop = () => {
	recordBtn.innerText = 'Download Recording';
	recordBtn.classList.remove('stop');
	recordBtn.classList.add('download');
	recordBtn.removeEventListener('click', handleStop);
	recordBtn.addEventListener('click', handleDownload);
	recorder.stop();

	// turning off camera
	video.pause();
	stream.getTracks()[0].stop();
};
const handleStart = async () => {
	stream = await navigator.mediaDevices.getUserMedia({
		audio: false,
		video: true,
	});
	video.srcObject = stream;
	video.play();

	recordBtn.innerText = 'Stop Recording';
	recordBtn.classList.add('stop');
	recordBtn.removeEventListener('click', handleStart);
	recordBtn.addEventListener('click', handleStop);
	recorder = new MediaRecorder(stream, {mimeType: 'video/webm'});
	recorder.ondataavailable = (event) => {
		videoFile = URL.createObjectURL(event.data);
		video.srcObject = null;
		video.src = videoFile;
		video.play();
	};
	recorder.start();
};
// const init = async () => {
// 	stream = await navigator.mediaDevices.getUserMedia({
// 		audio: false,
// 		video: true,
// 	});
// 	video.srcObject = stream;
// 	video.play();
// };

recordBtn.addEventListener('click', handleStart);
