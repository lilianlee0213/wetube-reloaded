const videoContainer = document.getElementById('videoContainer');
const creatorContainer = document.querySelector('.video-creator');
const buttonContainer = document.querySelector('.video-buttons');
const likeBtn = document.getElementById('likeBtn');

window.addEventListener('click', function (e) {
	const modal = creatorContainer.querySelector('.login-modal');
	if (e.target.dataset.button === 'subscribe') {
		modal.classList.toggle('active');
	} else {
		modal.classList.remove('active');
	}
});
const handleLoginModal = (e) => {
	let button = e.target.dataset.button;
	const modal = buttonContainer.querySelector('.login-modal');
	const title = modal.querySelector('h3');
	const content = modal.querySelector('p');
	const buttons = buttonContainer.querySelectorAll('button');
	if (button === undefined) {
		button = e.target.parentElement.dataset.button;
	}

	if (button === 'like') {
		modal.classList.toggle('like');
		title.innerText = 'Like this video?';
		content.innerText = 'Sign in to make your opinion count.';
	}
	// if (button === 'share') {
	// 	modal.classList.toggle('share');
	// }
	if (button === 'save') {
		modal.classList.toggle('save');
		title.innerText = 'Want to watch this agian later?';
		content.innerText = 'Sign in to add this video to a playlist.';
	}
	if (button === 'more') {
		modal.classList.toggle('more');
		title.innerText = 'Need to report the video?';
		content.innerText = 'Sign in to report inappropriate content.';
	}

	buttons.forEach((btn) => {
		if (btn.dataset.button !== button) {
			modal.classList.remove(btn.dataset.button);
		}
	});
};
buttonContainer.addEventListener('click', handleLoginModal);
let liked = false;

const handleLikeBtn = (isLiked) => {
	const rating = document.getElementById('rating');
	likeBtn.firstChild.classList.toggle('liked');
	if (likeBtn.firstChild.classList.contains('liked')) {
		liked = true;
	} else {
		liked = false;
	}
	if (liked && isLiked) {
		rating.innerText++;
		likeBtn.firstChild.classList.add('liked');
	} else if (!liked && !isLiked) {
		rating.innerText--;
		likeBtn.firstChild.classList.remove('liked');
	} else if (liked && !isLiked) {
		// has been liked, remove liked
		rating.innerText--;
		likeBtn.firstChild.classList.remove('liked');
	}
};
const handleLike = async () => {
	const {id} = videoContainer.dataset;
	const response = await fetch(`/api/videos/${id}/rating`, {
		method: 'POST',
	});
	if (response.status === 200) {
		const {isLiked} = await response.json();
		handleLikeBtn(isLiked);
		liked = isLiked;
	}
};
if (likeBtn) {
	likeBtn.addEventListener('click', handleLike);
}
