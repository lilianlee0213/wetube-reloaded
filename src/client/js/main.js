import '../scss/styles.scss';

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

const dropdown = document.getElementById('dropdown');
const userDropdown = document.getElementById('userDropdown');

document.addEventListener('click', function (e) {
	const btn = e.target.parentElement;
	if (btn.id !== 'dropdown__btn') {
		dropdown.classList.remove('active');
	} else {
		dropdown.classList.toggle('active');
	}
	if (btn.id !== 'userDropdown__btn') {
		userDropdown.classList.remove('active');
	} else {
		userDropdown.classList.toggle('active');
	}
});
