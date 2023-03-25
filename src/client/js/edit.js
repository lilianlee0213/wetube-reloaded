const form = document.querySelector('.edit-form__input');
const inputs = form.querySelectorAll('input');
const updateBtn = document.querySelector('.update-btn');
const cancelBtn = document.querySelector('.cancel-btn');
const avatarInput = document.querySelector('.avatar-input');
const textarea = document.querySelector('textarea');
let newDescription;

// Button Styles
const handleAddStyle = (label) => {
	updateBtn.classList.add('active');
	cancelBtn.classList.add('active');
	label.classList.add('active');
};

const handleRemoveStyle = (label) => {
	updateBtn.classList.remove('active');
	cancelBtn.classList.remove('active');
	label.classList.remove('active');
};

const handleTextarea = (e) => {
	const newDescription = e.target.value;
	const label = textarea.previousSibling;
	textarea.innerHTML !== newDescription
		? handleAddStyle(label)
		: handleRemoveStyle(label);
	cancelBtn.addEventListener('click', () => {
		e.target.value = textarea.innerHTML;
		handleRemoveStyle(label);
	});
};
inputs.forEach((input) => {
	const inputValue = input.value;
	const label = input.previousSibling;
	input.addEventListener('input', (e) => {
		e.target.value !== inputValue
			? handleAddStyle(label)
			: handleRemoveStyle(label);
	});
	cancelBtn.addEventListener('click', (e) => {
		if (inputValue !== input.value) {
			input.value = inputValue;
			handleRemoveStyle(label);
		}
	});
});

// Edit-Profile(Avatar)
const changeAvatar = (e) => {
	const avatar = document.getElementById('avatar');
	changeFile(avatar);
};
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

if (textarea) {
	textarea.addEventListener('input', handleTextarea);
}

if (avatarInput) {
	avatarInput.addEventListener('change', changeAvatar);
}
