// sliderTrack
/* 
// конечный слайдер
let currentSlide = 0;
const slides = document.querySelectorAll('.slider__slide');
const totalSlides = slides.length;

function showSlide(index) {
	// Скрыть все слайды
	slides.forEach(slide => {
		slide.classList.remove('active');
	});

	// Показать слайд по текущему индексу
	slides[index].classList.add('active');

	// Отключение кнопок на первом и последнем слайде
	document.querySelector('.slider__button_prev').disabled = index === 0;
	document.querySelector('.slider__button_next').disabled = index === totalSlides - 1;
}

// Показать следующий слайд
function nextSlide() {
	if (currentSlide < totalSlides - 1) {
		currentSlide++;
		showSlide(currentSlide);
	}
}

// Показать предыдущий слайд
function prevSlide() {
	if (currentSlide > 0) {
		currentSlide--;
		showSlide(currentSlide);
	}
}

// Инициализация слайдера, показываем первый слайд
showSlide(currentSlide);

// Логика для кнопок "Назад" и "Вперед"
document.querySelector('.slider__button_next').addEventListener('click', nextSlide);
document.querySelector('.slider__button_prev').addEventListener('click', prevSlide);

// Добавление touch-функционала для мобильных устройств
let startX = 0;
let endX = 0;

const sliderTrack = document.querySelector('.sliderTrack');

// Отслеживание начала касания
sliderTrack.addEventListener('touchstart', e => {
	startX = e.touches[0].clientX;
});

// Отслеживание движения пальца
sliderTrack.addEventListener('touchmove', e => {
	endX = e.touches[0].clientX;
});

// Отслеживание завершения касания
sliderTrack.addEventListener('touchend', () => {
	const threshold = 50; // Минимальное расстояние для срабатывания свайпа

	if (startX - endX > threshold) {
		// Свайп влево - следующий слайд
		nextSlide();
	} else if (endX - startX > threshold) {
		// Свайп вправо - предыдущий слайд
		prevSlide();
	}
});
 */

/* // Запуск автопрокрутки
function startAutoSlide() {
	refreshInterval = setInterval(() => {
		buttonNext.click();
	}, 3000);
}

// Сброс автопрокрутки
function resetAutoSlide() {
	clearInterval(refreshInterval);
	startAutoSlide();
} */
//=======================================================

// const swiper = new Swiper('.swiper', {
// 	// Optional parameters
// 	loop: true,

// 	// Navigation arrows
// 	navigation: {
// 		nextEl: '.swiper-button-buttonNext',
// 		prevEl: '.swiper-button-buttonPrev',
// 	},
// });
