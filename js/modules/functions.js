export const iconMenu = document.querySelector('.icon-menu');
export const htmlElement = document.documentElement;

// const header = document.querySelector('.header');

//=======================================================

// Вспомогательные модули блокировки прокрутки и скачка
export let bodyLockStatus = true;

// все элементы, у которых есть атрибут data-lp (если position: fixed)
export const lockPaddingElements = document.querySelectorAll('[data-lp]');
console.debug('lockPaddingElements', lockPaddingElements);

// ширина scroll-bar
// export const lockPaddingValue = window.innerWidth - document.body.offsetWidth + 'px';
// Объявляем переменную вне функций
export let lockPaddingValue;

// Функция для обновления значения lockPaddingValue
function updateLockPaddingValue() {
	// ширина scroll-bar
	lockPaddingValue = window.innerWidth - document.body.offsetWidth + 'px';
	console.log('Значение обновлено:', lockPaddingValue); // Для проверки
}
// Обновляем значение при загрузке страницы
updateLockPaddingValue();
console.debug('lockPaddingValue', lockPaddingValue);

// Обновляем значение при изменении размера окна
window.addEventListener('resize', updateLockPaddingValue);

//=======================================================

// * если для html задан scrollbar-gutter: stable;
export const supportsScrollbarGutter = CSS.supports('scrollbar-gutter', 'stable'); // * проверяем поддержку браузером - Я
console.debug('supportsScrollbarGutter', supportsScrollbarGutter); // true or false

// Получаем вычисленные стили элемента html - Я
const computedStyle = window.getComputedStyle(htmlElement);

// Проверяем значение свойства scrollbar-gutter - Я
export const scrollbarGutterValue = computedStyle.getPropertyValue('scrollbar-gutter');
console.debug('scrollbarGutterValue', scrollbarGutterValue); // stable

// добавить paddingRight (ширина scroll-bar) к body и элементам с data-lp с задержкой
export let bodyLock = (delay = 500) => {
	if (bodyLockStatus) {
		// * если свойство scrollbar-gutter: stable не поддерживается браузером или не stable - Я
		if (!supportsScrollbarGutter || scrollbarGutterValue !== 'stable') {
			lockPaddingElements.forEach(lockPaddingElement => {
				lockPaddingElement.style.paddingRight = lockPaddingValue;
			});

			document.body.style.paddingRight = lockPaddingValue;
		}
		htmlElement.classList.add('lock');
		bodyLockStatus = false;

		setTimeout(function () {
			bodyLockStatus = true;
		}, delay);
	}
};

// удалить paddingRight (ширина scroll-bar) у body и у элементов с data-lp с задержкой
export let bodyUnlock = (delay = 500) => {
	if (bodyLockStatus) {
		// удалять с задержкой 500ms, чтобы резко не появлялся scroll-bar
		setTimeout(() => {
			// если браузер не поддерживает scrollbar-gutter: stable или не установлено значение stable
			if (!supportsScrollbarGutter || scrollbarGutterValue !== 'stable') {
				lockPaddingElements.forEach(lockPaddingElement => {
					lockPaddingElement.style.paddingRight = '';
				});
				document.body.style.paddingRight = '';
			}
			htmlElement.classList.remove('lock');
		}, delay);

		bodyLockStatus = false;

		setTimeout(function () {
			bodyLockStatus = true;
		}, delay);
	}
};

// добавить/удалить class="lock" к html/document.documentElement
// export let bodyLockToggle = (delay = 5000) => {
// 	if (htmlElement.classList.contains('lock')) {
// 		bodyUnlock(delay);
// 	} else {
// 		bodyLock(delay);
// 	}
// };
export let bodyLockToggle = (delay = 500) => {
	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	const actionDelay = prefersReducedMotion ? 0 : delay;

	if (htmlElement.classList.contains('lock')) {
		bodyUnlock(actionDelay);
	} else {
		bodyLock(actionDelay);
	}
};
//=======================================================
// Модуль работы с меню (бургер)
export function menuInit() {
	if (iconMenu) {
		// updateLockPaddingElements();
		document.addEventListener('click', function (e) {
			if (bodyLockStatus && e.target.closest('.icon-menu')) {
				bodyLockToggle();

				htmlElement.classList.toggle('menu-open');
				// updateTabindex();

				if (htmlElement.classList.contains('menu-open')) {
					showMenu();
					/* // Находим первую ссылку в меню и устанавливаем на нее фокус
					if (firstMenuLink) {
						firstMenuLink.focus();
					} */
				} else {
					hideMenu();
				}
			}
		});

		// Обработчик события keydown на иконку меню - Я
		iconMenu.addEventListener('keydown', function (e) {
			// если tab по иконки меню, то не закрываем меню - бегаем по пунктам меню
			if (e.key === 'Tab' && htmlElement.classList.contains('menu-open') && document.activeElement === iconMenu) {
				e.preventDefault();
				if (firstMenuLink) {
					firstMenuLink.focus();
				}
			}
		});

		// при клике на Esc закрыть выпадающее меню - Я
		document.addEventListener('keydown', function (e) {
			if (e.key === 'Escape' && htmlElement.classList.contains('menu-open')) {
				menuClose();
				hideMenu();
				// updateTabindex();
				iconMenu.focus();
			}
		});
	}
}

// добавить class="menu-open" к html=document.documentElement
export function menuOpen() {
	bodyLock();
	htmlElement.classList.add('menu-open');
}

// удалить class="menu-open" у html/document.documentElement
export function menuClose() {
	bodyUnlock();
	htmlElement.classList.remove('menu-open');
}

/* TABINDEX  - Я */
// export const htmlElement = document.documentElement;
// export const iconMenu = document.querySelector('.icon-menu');
export const wrapper = document.querySelector('.wrapper');
export const menuBody = document.querySelector('.menu__body');
export const menuList = document.querySelector('.menu__list');
export const menuLinks = document.querySelectorAll('.menu__link');
export const firstMenuLink = menuLinks[0];

export function hideMenu() {
	if (iconMenu) {
		iconMenu.setAttribute('aria-expanded', 'false');
		menuList.setAttribute('aria-hidden', 'true');
		menuBody.style.left = '-100%';
	}
	if (menuLinks) {
		menuLinks.forEach(link => {
			link.setAttribute('tabindex', '-1');
		});
	}
}

/* export function showMenu() {
	iconMenu.setAttribute('aria-expanded', 'true');

	// menuList.setAttribute('aria-hidden', 'false');
	menuLinks.forEach(link => {
		link.setAttribute('tabindex', '0');
	});
} */
export function showMenu() {
	if (iconMenu) {
		iconMenu.setAttribute('aria-expanded', 'true');
		menuList.setAttribute('aria-hidden', 'false');
		menuBody.style.left = wrapper.getBoundingClientRect().left + 'px';
	}
	if (menuLinks) {
		menuLinks.forEach(link => {
			link.setAttribute('tabindex', '0');
		});
	}
}
/* 
export function updateTabindex() {
	if (window.innerWidth <= 767.98) {
		hideMenu();
	} else {
		showMenu();
	}
} */

/* updateTabindex();
window.addEventListener('resize', updateTabindex); */
/* if (menuLinks.length > 0) {
	updateTabindex();
}
window.addEventListener('resize', updateTabindex); */
//=======================================================
// * установить tabindex -1 для блока к которому прокрутили из nav - Я
// export function focusTargetBlock(block) {
// 	block.setAttribute('tabindex', '-1');
// 	// * при клике на Tab фокус на блоке - Я - не работает
// 	/* 	document.documentElement.addEventListener('keydown', function (e) {
// 		if (e.key === 'Tab') {
// 			e.preventDefault();
// 			block.focus();
// 		}
// 	}); */
// 	block.focus();
// 	block.addEventListener(
// 		'focusout',
// 		() => {
// 			block.removeAttribute('tabindex');
// 		},
// 		{ once: true }
// 	);
// }

export let isScrollingFromMenu = false;

menuLinks.forEach(menuLink => {
	menuLink.addEventListener('click', function (e) {
		// e.preventDefault();
		if (document.documentElement.classList.contains('menu-open')) {
			// Закрываем меню, если оно открыто
			menuClose();
			// tabindex на menu__link и aria-expanded на iconMenu
			hideMenu();
		}
	});
});
