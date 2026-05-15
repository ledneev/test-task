function renderColors(colors, carId) {
  return colors.map((color, i) => `
    <button
      class="car-card__color-btn ${i === 0 ? 'car-card__color-btn--active' : ''}"
      style="background: ${color.hex}"
      data-img="assets/img/cars/${carId}/${color.img}"
      data-car="${carId}"
      title="${color.name}"
      aria-label="${color.name}"
    ></button>
  `).join('');
}

function renderFeatures(features) {
  return features.map(f => `
    <li class="car-card__feature">${f}</li>
  `).join('');
}

function renderCard(car) {
  return `
    <div class="swiper-slide">
      <article class="car-card">

        <div class="car-card__badge">${car.badge}</div>

        <div class="car-card__header">
          <div class="car-card__info">
            <h2 class="car-card__name">${car.name}</h2>
            <p class="car-card__benefit">Выгода до <span class="car-card__price">${car.benefit}</span></p>
          </div>
          <button class="car-card__testdrive open-modal">
            Записаться на тест-драйв
          </button>
        </div>

        <div class="car-card__img-wrap">
          <img
            src="${car.colors[0].img}"
            alt="${car.name}"
            class="car-card__img"
            id="car-img-${car.id}"
          >
        </div>

        <div class="car-card__colors">
          ${renderColors(car.colors, car.id)}
        </div>

        <ul class="car-card__features">
          ${renderFeatures(car.features)}
        </ul>

        <div class="car-card__actions">
          <button class="button button--teal car-card__btn open-modal">Узнать стоимость</button>
          <button class="button button--black car-card__btn open-modal">Рассчитать кредит</button>
          <button class="button button--outline car-card__btn open-modal">Подобрать комплектацию</button>
        </div>

      </article>
    </div>
  `;
}

document.getElementById('cars-list').innerHTML = cars.map(renderCard).join('');

document.addEventListener('click', e => {
  const btn = e.target.closest('.car-card__color-btn');
  if (!btn) return;

  const carId = btn.dataset.car;
  const img = document.getElementById(`car-img-${carId}`);

  btn.closest('.car-card__colors')
    .querySelectorAll('.car-card__color-btn')
    .forEach(b => b.classList.remove('car-card__color-btn--active'));
  btn.classList.add('car-card__color-btn--active');

  img.style.opacity = '0';
  setTimeout(() => {
    img.src = btn.dataset.img;
    img.onload = () => { img.style.opacity = '1'; };
  }, 200);
});

new Swiper('.cars__swiper', {
  slidesPerView: 1,
  spaceBetween: 24,
  pagination: { el: '.swiper-pagination', clickable: true },
  navigation: {
    prevEl: '.swiper-button-prev',
    nextEl: '.swiper-button-next',
  },
  breakpoints: {
    768: { slidesPerView: 2 },
  },
});