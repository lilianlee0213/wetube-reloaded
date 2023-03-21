const videoContainer = document.getElementById('videoContainer');
const form = document.getElementById('commentForm');
const comments = document.querySelectorAll('.comment-view__list');

comments.forEach((comment) => {
	const modalBtn = comment.querySelector('.option-modal__btn');
	const optionBox = comment.querySelector('.option-box');
	if (modalBtn) {
		modalBtn.addEventListener('click', function (e) {
			e.target.parentElement.classList.toggle('active');
			optionBox.classList.toggle('active');
		});
	}
});

const handleCommentBtn = (event) => {
	const commentBtn = form.querySelector('.comment');
	commentBtn.style.backgroundColor = textarea.value ? '#065fd4' : '#f0f0f0';
	commentBtn.style.color = textarea.value ? '#def1ff' : '#606060';
};
// const modalBtn = document.querySelectorAll('.option-modal__btn i');
// const showModal = (e) => {
// 	e.target.parentElement.classList.toggle('acitve');
// 	e.target.parentElement.nextSibling.classList.toggle('active');
// 	if()
// 	const commentId = e.target.parentElement.parentElement.dataset.id;
// };
// modalBtn.forEach((btn) => btn.addEventListener('click', showModal));

const addComment = (text, id, commentUser, avatar, username, lastname) => {
	const commentContainer = document.querySelector('.comment-view');
	const newComment = document.createElement('div');
	const a = document.createElement('a');
	const img = document.createElement('img');
	const contentBox = document.createElement('div');
	const span1 = document.createElement('span');
	const span2 = document.createElement('span');
	const p = document.createElement('p');
	const optionModal = document.createElement('div');
	const modalBtn = document.createElement('button');
	const modalIcon = document.createElement('i');
	const optionBox = document.createElement('div');
	const editBtn = document.createElement('button');
	const deleteBtn = document.createElement('button');

	newComment.dataset.id = id;
	newComment.classList = 'comment-view__list';
	newComment.style.marginBottom = '40px';
	// avatar
	a.href = commentUser;
	if (!avatar) {
		a.classList = 'avatar no-image';
		img.remove();
		const initial = document.createElement('span');
		initial.innerText = lastname.substring(0, 1);
		a.appendChild(initial);
	} else {
		img.src = avatar;
		img.crossOrigin = 'crossOrigin';
		img.classList = 'avatar';
	}
	// comment contents
	contentBox.classList = 'comment-view__content';
	span1.innerText = username;
	span2.innerHTML = 'Just now';
	p.innerText = text;

	//comment option buttons(delete & edit)
	optionModal.classList = 'option-modal';
	optionModal.dataset.id = id;
	modalBtn.classList = 'option-modal__btn';
	modalIcon.classList = 'fa fa-ellipsis-v';
	optionBox.classList = 'option-box';
	editBtn.classList = 'edit-btn';
	editBtn.innerText = 'Edit';
	deleteBtn.classList = 'delete-btn';
	deleteBtn.innerHTML = 'Delete';

	// append all elements in html
	commentContainer.prepend(newComment);
	newComment.append(a);
	a.appendChild(img);
	newComment.appendChild(contentBox);
	contentBox.appendChild(span1);
	contentBox.appendChild(span2);
	contentBox.appendChild(p);
	newComment.appendChild(optionModal);
	optionModal.appendChild(modalBtn);
	optionModal.appendChild(optionBox);
	modalBtn.appendChild(modalIcon);
	optionBox.appendChild(editBtn);
	optionBox.appendChild(deleteBtn);

	modalBtn.addEventListener('click', function (e) {
		optionBox.classList.toggle('active');
	});
	deleteBtn.addEventListener('click', handleDeleteComment);
};
const handleToggle = (item) => {
	item.classList.toggle('active');
};
const handleSubmit = async (event) => {
	event.preventDefault();
	const textarea = form.querySelector('textarea');
	const text = textarea.value;
	const videoId = videoContainer.dataset.id;
	if (text === '') {
		return;
	}
	const response = await fetch(`/api/videos/${videoId}/comment`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({text: text}),
	});
	if (response.status === 201) {
		textarea.value = '';
		const {
			commentId,
			commentUser,
			commentAvatarUrl,
			commentUsername,
			commentLastName,
		} = await response.json();
		addComment(
			text,
			commentId,
			commentUser,
			commentAvatarUrl,
			commentUsername,
			commentLastName
		);
	}
};
const deleteBtn = document.querySelectorAll('.delete-btn');

const handleDeleteComment = (event) => {
	const videoId = videoContainer.dataset.id;
	const commentId = event.target.parentElement.parentElement.dataset.id;
	fetch(`/api/videos/${videoId}/comment/delete`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({commentId}),
	});
	window.location.reload();
};

if (form) {
	form.addEventListener('submit', handleSubmit);
	textarea.addEventListener('input', handleCommentBtn);
}

if (deleteBtn) {
	deleteBtn.forEach((btn) =>
		btn.addEventListener('click', handleDeleteComment)
	);
}
