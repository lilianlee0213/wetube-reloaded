import '../scss/styles.scss';
const settingDropdownBtn = document.getElementById('settingDropdown__btn');
const settingDropdown = document.getElementById('settingDropdown');

const loggedInDropdown = document.getElementById('loggedInDropdown');
const loggedInDropdownBtn = document.getElementById('loggedInDropdown__btn');

settingDropdownBtn.addEventListener('click', function () {
	if (loggedInDropdown.classList.contains('active')) {
		loggedInDropdown.classList.remove('active');
	}
	settingDropdown.classList.toggle('active');
});
loggedInDropdownBtn.addEventListener('click', function () {
	if (settingDropdown.classList.contains('active')) {
		settingDropdown.classList.remove('active');
	}
	loggedInDropdown.classList.toggle('active');
});

const sidebarBtn = document.querySelector('.sidebar__icon');
const sidebar = document.querySelector('.sidebar');
sidebarBtn.addEventListener('click', function () {
	if (this.active) {
		sidebar.classList.remove('sidebar__toggle');
	} else {
		sidebar.classList.add('sidebar__toggle');
	}
	this.active = !this.active;
});

sidebarBtn.active = false;
