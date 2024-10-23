// https://github.com/HoanghoDev/slider_dots/blob/main/app.js
// бесконечный слайдер
let sliderTrack = document.querySelector('.slider__track');
let slides = document.querySelectorAll('.slide');
let buttonNext = document.querySelector('.slider__button_next');
let buttonPrev = document.querySelector('.slider__button_prev');

let lengthSlides = slides.length - 1;
let active = 0;
let refreshInterval;

// для мобильных устройств
let startX = 0;
let endX = 0;

/* // Добавляем плавный переход
if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
	sliderTrack.style.transition = 'transform 0.5s ease-in-out';
} */

// Инициализация слайдера
export function initSlider() {
	// Обновляем слайдер при изменении размера окна
	window.addEventListener('resize', reloadSlider);

	// Добавляем обработчики событий для кнопок "buttonNext" и "buttonPrev"
	buttonNext.addEventListener('click', nextSlide);
	buttonPrev.addEventListener('click', prevSlide);

	// buttonPrev.addEventListener('click', function (e) {
	// 	console.debug('buttonPrev', 'clicked');
	// });
	// buttonNext.addEventListener('click', function (e) {
	// 	console.debug('buttonNext', 'clicked');
	// });

	// Изначально обновляем состояние кнопки "buttonPrev"
	updateButtonsState();

	//! Запускаем автопрокрутку
	//startAutoSlide();

	// Добавление touch-функционала для мобильных устройств
	// Отслеживание начала касания
	sliderTrack.addEventListener('touchstart', e => {
		startX = e.touches[0].clientX;

		resetAutoSlide(); // Остановить автопрокрутку при начале касания
	});

	// Отслеживание движения пальца
	sliderTrack.addEventListener('touchmove', e => {
		endX = e.touches[0].clientX;

		resetAutoSlide(); //?
	});

	// Отслеживание завершения касания
	sliderTrack.addEventListener('touchend', () => {
		handleSwipe();

		//startAutoSlide(); //? Запускаем автопрокрутку снова
	});

	// Настраиваем IntersectionObserver для запуска автопрокрутки при видимости блока .projects
	const sectionProjects = document.querySelector('.slider');
	const observerProjects = new IntersectionObserver(handleVisibility, {
		root: null,
		threshold: 0.1, // Срабатывает, когда хотя бы 10% блока видны
	});
	observerProjects.observe(sectionProjects);
}

// Обработка видимости элемента
function handleVisibility(entries) {
	const entry = entries[0];
	if (entry.isIntersecting) {
		//! // Запускаем автопрокрутку, когда блок виден
		// при условии, что пользователь не предпочитает уменьшенное движение
		if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
			startAutoSlide();
		}
	} else {
		stopAutoSlide(); // Останавливаем автопрокрутку, когда блок не виден
	}
}

// Функция для обработки свайпа
function handleSwipe() {
	const threshold = 50; // Минимальное расстояние для срабатывания свайпа

	// Если на первом слайде
	if (active === 0 && endX - startX > threshold) {
		// Свайп вправо - игнорируем
		return;
	}

	// Если на последнем слайде
	if (active === lengthSlides) {
		if (startX - endX > threshold) {
			// Свайп влево - переходим к первому слайду
			nextSlide();
		} else if (endX - startX > threshold) {
			// Свайп вправо - переходим к предыдущему слайду
			prevSlide();
		}
		return;
	}

	// Обычная логика для остальных слайдов
	if (startX - endX > threshold) {
		// Свайп влево - следующий слайд
		nextSlide();
	} else if (endX - startX > threshold) {
		// Свайп вправо - предыдущий слайд
		prevSlide();
	}
}

// Функция для перехода на следующий слайд
function nextSlide() {
	if (active < lengthSlides) {
		active++;
	} else {
		active = 0; // Сбрасываем на первый слайд
	}
	reloadSlider();
}

// Функция для перехода на предыдущий слайд
function prevSlide() {
	if (active > 0) {
		active--;
	} else {
		active = lengthSlides; // Переход к последнему слайду, если мы на первом
	}
	reloadSlider();
}

// Функция для перезагрузки слайдера
function reloadSlider() {
	let offset = -slides[active].offsetLeft;
	sliderTrack.style.transform = `translateX(${offset}px)`;

	if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
		// Сбрасываем и перезапускаем автопрокрутку
		resetAutoSlide();
	}

	// Обновляем состояние кнопок
	updateButtonsState();
}

// Функция для обновления состояния кнопок
function updateButtonsState() {
	buttonPrev.disabled = active === 0; // Если активный слайд первый, отключаем кнопку

	if (active === lengthSlides) {
		buttonNext.classList.add('last-slide'); // Добавляем класс для стиля
	} else {
		buttonNext.classList.remove('last-slide'); // Убираем класс, если не на последнем
	}
}

let autoSlideInterval;
let isAutoSliding = false; // Флаг, указывающий, активна ли автопрокрутка

// Запуск автопрокрутки
export function startAutoSlide() {
	if (!isAutoSliding) {
		// Проверяем, не запущена ли автопрокрутка
		autoSlideInterval = setInterval(nextSlide, 3000); // 3000 мс = 3 секунды
		isAutoSliding = true; // Устанавливаем флаг, что автопрокрутка активна
	}
}

// Сброс автопрокрутки
function resetAutoSlide() {
	clearInterval(autoSlideInterval); // Останавливаем текущую автопрокрутку
	isAutoSliding = false; // Сбрасываем флаг
	startAutoSlide(); // Запускаем автопрокрутку снова
}

// Остановка автопрокрутки
function stopAutoSlide() {
	clearInterval(autoSlideInterval); // Останавливаем автопрокрутку
	isAutoSliding = false; // Устанавливаем флаг, что автопрокрутка остановлена
}

/* 
// Запуск автопрокрутки
export function startAutoSlide() {
	autoSlideInterval = setInterval(nextSlide, 3000); // 3000 мс = 3 секунды
}

// Сброс автопрокрутки
function resetAutoSlide() {
	clearInterval(autoSlideInterval);
	startAutoSlide(); //! Перезапускаем автопрокрутку
}

// останавливаем автопрокрутку
function stopAutoSlide() {
	clearInterval(autoSlideInterval);
} 
*/
