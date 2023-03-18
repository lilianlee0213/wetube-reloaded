const videoContainer = document.getElementById('videoContainer');
const form = document.getElementById('commentForm');
const textarea = form.querySelector('textarea');
const commentBtn = form.querySelector('.comment');

const handleSubmit = (event) => {
	event.preventDefault();
	const text = textarea.value;
	const videoId = videoContainer.dataset.id;
	if (text === '') {
		return;
	}
	fetch(`/api/videos/${videoId}/comment`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({text: text}),
	});
	textarea.value = '';
};

if (form) {
	form.addEventListener('submit', handleSubmit);
}
