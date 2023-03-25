const videoContainer = document.getElementById('videoContainer');
const creatorContainer = document.querySelector('.video-creator');
const buttonContainer = document.querySelector('.video-buttons');
const likeBtn = document.getElementById('likeBtn');
let liked = false;

window.addEventListener('click', function (e) {
	const subscribeModal = creatorContainer.querySelector('.login-modal');
	const modal = buttonContainer.querySelector('.login-modal');
	let button = e.target.dataset.button;

	if (subscribeModal) {
		button === 'subscribe'
			? subscribeModal.classList.toggle('subscribe')
			: subscribeModal.classList.remove('subscribe');
	}
	if (modal) {
		const buttons = buttonContainer.querySelectorAll('button');
		const title = modal.querySelector('h3');
		const content = modal.querySelector('p');

		if (button === undefined) {
			button = e.target.parentElement.dataset.button;
		}

		buttons.forEach((btn) => {
			if (btn.dataset.button !== button) {
				modal.classList.remove(btn.dataset.button);
			}
		});
		if (button === 'like') {
			modal.classList.toggle('like');
			title.innerText = 'Like this video?';
			content.innerText = 'Sign in to make your opinion count.';
		}
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
	}
});

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
