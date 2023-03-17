import '../scss/styles.scss';

const sidebarBtn = document.getElementById('sidebarIcon');
const sidebar = document.getElementById('sidebar');
const dropdown = document.getElementById('dropdown');
const userDropdown = document.getElementById('userDropdown');

document.addEventListener('click', function (e) {
	const btn = e.target.parentElement;
	if (btn.id !== 'dropdownBtn') {
		dropdown.classList.remove('active');
	} else {
		dropdown.classList.toggle('active');
	}
	// only when loggedIn
	if (userDropdown) {
		if (btn.id !== 'userDropdownBtn') {
			userDropdown.classList.remove('active');
		} else {
			userDropdown.classList.toggle('active');
		}
	}
});

sidebarBtn.addEventListener('click', function () {
	if (this.active) {
		sidebar.classList.remove('sidebar-toggle');
	} else {
		sidebar.classList.add('sidebar-toggle');
	}
	this.active = !this.active;
});

sidebarBtn.active = false;
