const form = document.querySelector('.edit-form__input');
const inputs = form.querySelectorAll('input');
const updateBtn = document.querySelector('.update-btn');
const cancelBtn = document.querySelector('.cancel-btn');
const avatarInput = document.querySelector('.avatar-input');

const changeFile = (avatar) => {
	let imageSrc = avatar.src;
	const reader = new FileReader();
	reader.onload = (e) => {
		avatar.src = e.target.result;
		updateBtn.classList.add('active');
		cancelBtn.classList.add('active');
		cancelBtn.addEventListener('click', (e) => {
			avatar.src = imageSrc;
			updateBtn.classList.remove('active');
			cancelBtn.classList.remove('active');
		});
	};
	if (avatarInput.files[0]) {
		reader.readAsDataURL(avatarInput.files[0]);
	}
};
const changeAvatar = (e) => {
	const avatar = document.getElementById('avatar');
	changeFile(avatar);

	// when users have not set their picture
};

avatarInput.addEventListener('change', changeAvatar);
inputs.forEach((input) => {
	const inputValue = input.value;
	const label = input.previousSibling;
	input.addEventListener('input', (e) => {
		updateBtn.classList.remove('active');
		cancelBtn.classList.remove('active');
		label.classList.remove('active');
		if (e.target.value !== inputValue) {
			updateBtn.classList.add('active');
			cancelBtn.classList.add('active');
			label.classList.add('active');
		}
	});
	cancelBtn.addEventListener('click', (e) => {
		if (inputValue !== input.value) {
			input.value = inputValue;
			updateBtn.classList.remove('active');
			cancelBtn.classList.remove('active');
		}
	});
});
