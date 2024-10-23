import * as flsFunctions from './modules/functions.js';
// import { initSlider, startAutoSlide, resetAutoSlide } from './modules/slider.js';
import { initSlider } from './modules/slider.js';
/* Модуль "Попапы" */
import './modules/popup.js';

document.addEventListener('DOMContentLoaded', function () {
	// Включить/выключить FLS (Full Logging System) (в работе)
	window['FLS'] = true;

	// Модуль для работы с меню (Бургер)
	// Обработка клика вне меню и burger icon - Я
	document.addEventListener('click', function (e) {
		// иконка бургер
		const iconMenu = document.querySelector('.icon-menu');
		// ссылка меню, по которой был клик
		const clickedLink = e.target.closest('.menu__link');
		// само выпадающее меню
		const menuList = e.target.closest('.menu__list');

		// Проверяем, был ли клик выполнен вне ссылки меню, вне burger icon и вне span внутри элемента iconMenu
		if (!clickedLink && e.target !== iconMenu && !iconMenu.contains(e.target) && !menuList) {
			// если выпадающее меню открыто
			if (flsFunctions.htmlElement.classList.contains('menu-open')) {
				// закрываем меню, убираем блокировку
				flsFunctions.menuClose();
				// tabindex на menu__link и aria-expanded на iconMenu
				flsFunctions.hideMenu();
			}
		}
	});
	flsFunctions.menuInit();
	flsFunctions.hideMenu();
	//=======================================================
	// Инициализация слайдера при загрузке страницы
	initSlider();

	//=======================================================

	/* sticky icon-menu and logo__icon */
	const htmlElement = document.documentElement;
	const wrapper = document.querySelector('.wrapper');
	const iconMenu = document.querySelector('.icon-menu');
	const sectionHero = document.querySelector('.hero');
	const innerWidth = document.querySelector('.hero__inner');
	const header = document.querySelector('.header');
	const logoIcon = document.querySelector('.header .logo__icon');
	const menuBody = document.querySelector('.menu__body');

	console.debug('innerWidth', innerWidth.getBoundingClientRect().width);

	const getStickyIconMenu = function (entries) {
		const entry = entries[0];
		console.debug('entry', entry);
		if (!entry.isIntersecting) {
			iconsFix();
		} else {
			iconsUnfix();
		}
	};

	function iconsFix() {
		// iconMenu.classList.add('sticky');
		header.classList.add('sticky');

		// Добавляем атрибут data-lp
		// iconMenu.setAttribute('data-lp', '');
		logoIcon.style.left = innerWidth.getBoundingClientRect().left + 'px';
		iconMenu.style.left = innerWidth.getBoundingClientRect().right - iconMenu.getBoundingClientRect().width + 'px'; // правый край hero__inner относительно левого края окна браузера - ширина icon-menu
		// iconMenu.style.left = innerWidth.getBoundingClientRect().width + 'px'; // не работает
		htmlClassSticky();
	}

	function iconsUnfix() {
		// iconMenu.classList.remove('sticky');
		header.classList.remove('sticky');
		iconMenu.style.left = 'auto';
		// Добавляем атрибут data-lp
		// iconMenu.removeAttribute('data-lp');
		if (htmlElement.classList.contains('sticky-icons')) {
			htmlElement.classList.remove('sticky-icons');
		}
	}

	// т.к. на устройствах уже 425px header становится в 2 ряда, но при прокрутке вниз icon-menu и logo__icon становятся fixed? что приводит к вырыванию их из потока и heder уменьшается
	function htmlClassSticky() {
		if (window.innerWidth < 425) {
			htmlElement.classList.add('sticky-icons');
		} else {
			htmlElement.classList.remove('sticky-icons');
		}
	}

	// Функция для пересчета позиции иконки и logo при изменении размеров окна
	function adjustPosition() {
		if (header.classList.contains('sticky')) {
			logoIcon.style.left = innerWidth.getBoundingClientRect().left + 'px';
			iconMenu.style.left = innerWidth.getBoundingClientRect().right - iconMenu.getBoundingClientRect().width + 'px';
		}
		if (document.documentElement.classList.contains('menu-open')) {
			menuBody.style.left = wrapper.getBoundingClientRect().left + 'px';
		}
	}

	const observerHero = new IntersectionObserver(getStickyIconMenu, {
		root: null,
		threshold: 0,
		// rootMargin: '-10px',
	});
	observerHero.observe(sectionHero);

	// Добавляем обработчик события изменения размера окна
	window.addEventListener('resize', adjustPosition);
	window.addEventListener('resize', htmlClassSticky);
	// window.addEventListener('orientationchange', adjustPosition);
	//=======================================================

	//=======================================================
	// получение form через forms и id-формы
	const form = document.forms.form;
	/* FORM INPUT PHONE */
	// const phoneInput = document.getElementById('phone');
	// const phoneInput = form.elements['phone'];
	const phoneInput = form.phone; // доступ по атрибуту name - для отправки формы name- ключ + значение
	const requiredDigits = 11; // Количество цифр после "+"

	phoneInput.addEventListener('input', function () {
		// Если поле не начинается с "+", добавляем его
		if (!phoneInput.value.startsWith('+')) {
			phoneInput.value = '+' + phoneInput.value.replace(/[^0-9]/g, '');
		}

		// Удаляем лишние символы, кроме одного "+"
		phoneInput.value = phoneInput.value.replace(/(?!^)\+/g, '').replace(/[^0-9+]/g, '');

		// Извлекаем цифры после "+"
		const digits = phoneInput.value.replace('+', '');

		// Проверка на количество цифр
		if (digits.length < requiredDigits) {
			phoneInput.setCustomValidity('+37212345678'); // Убираем ошибку, чтобы использовать сообщение +37212345678 в стандартной подсказке
		} else {
			phoneInput.setCustomValidity(''); // Убираем ошибку, если условие выполнено
		}

		// Если цифр больше 11, обрезаем лишние
		if (digits.length > 11) {
			phoneInput.value = '+' + digits.slice(0, 11);
		}
	});

	//=======================================================
	// const emailInput = document.getElementById('email');
	// const emailInput = form.elements['email'];
	const emailInput = form.email;

	emailInput.addEventListener('input', function () {
		const value = emailInput.value;

		// Проверяем, содержит ли значение символ "@" и далее хотя бы одну букву или цифру
		const hasAtSymbol = value.includes('@');
		const hasValidDomain = value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);

		if (hasAtSymbol && !hasValidDomain) {
			// Если есть "@" и недействительный домен, устанавливаем ошибку
			emailInput.setCustomValidity('email@address.com');
		} else {
			// В противном случае сбрасываем ошибку
			emailInput.setCustomValidity('');
		}
	});

	//=======================================================
	const formButton = form.button;
	// Сохраняем начальный текст кнопки
	const originalButtonText = formButton.textContent;
	console.debug('originalButtonText', originalButtonText);

	//* Добавляем обработчик события для отправки формы
	// Обработчик события для отправки формы
	form.addEventListener('submit', function (event) {
		event.preventDefault(); // Предотвращаем стандартное поведение отправки формы - убрать при реальной отправке

		setTimeout(() => {
			// Изменяем текст и добавляем класс для изменения стилей
			formButton.textContent = 'Request sent';
			formButton.classList.add('submit');
			console.debug('Форма отправлена!'); // Здесь можно обработать данные формы
		}, 200);

		// Имитация обработки данных перед сбросом формы
		setTimeout(() => {
			form.reset(); // Сбрасываем форму после обработки

			// Возвращаем исходный текст кнопки
			formButton.textContent = originalButtonText;
			formButton.classList.remove('submit');
			console.debug('Форма сброшена!');
		}, 2000); // Сбрасываем форму через 1 секунду
	});

	/* // Имитируем отправку формы через 20 секунд
	setTimeout(function () {
		console.log('Имитируем отправку формы через 20 секунд.');
		form.submit(); // Программно отправляем форму
	}, 2000); // 2000 миллисекунд = 20 секунд */

	// конец =======================================================
});
