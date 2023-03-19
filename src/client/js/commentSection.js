const videoContainer = document.getElementById('videoContainer');
const form = document.getElementById('commentForm');

const handleSubmit = (event) => {
	event.preventDefault();
	const text = textarea.value;
	const videoId = videoContainer.dataset.id;
	const textarea = form.querySelector('textarea');
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
const handleCommentBtn = (event) => {
	const commentBtn = form.querySelector('.comment');
	commentBtn.style.backgroundColor = textarea.value ? '#065fd4' : '#f0f0f0';
	commentBtn.style.color = textarea.value ? '#def1ff' : '#606060';
};
if (form) {
	form.addEventListener('submit', handleSubmit);
	textarea.addEventListener('input', handleCommentBtn);
}
