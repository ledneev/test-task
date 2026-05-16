async function loadSVG(filename) {
  const response = await fetch(`assets/img/cars-card/${filename}`);
  return await response.text();
}

function renderColors(colors, carId) {
  return colors.map((color, i) => `
    <button
      class="car-card__color-btn ${i === 0 ? 'car-card__color-btn--active' : ''}"
      style="background: ${color.hex}"
      data-img="${color.img}"
      data-car="${carId}"
      title="${color.name}"
      aria-label="${color.name}"
    ></button>
  `).join('');
}

async function renderFeatures(features) {
  const items = await Promise.all(features.map(async f => {
    const svg = await loadSVG(f.icon);
    return `
      <li class="car-card__feature">
        <span class="car-card__feature-icon">${svg}</span>
        <span>${f.text}</span>
      </li>
    `;
  }));
  return items.join('');
}

async function renderCard(car) {
  const featuresHTML = await renderFeatures(car.features);
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
            <img src="assets/img/cars-card/pen.svg" alt="" width="16" height="16">
            Записаться<br>на тест-драйв
          </button>
        </div>
        <div class="car-card__img-wrap">
          <img src="${car.colors[0].img}" alt="${car.name}" class="car-card__img" id="car-img-${car.id}">
        </div>
        <div class="car-card__colors">
          ${renderColors(car.colors, car.id)}
        </div>
        <ul class="car-card__features">
          ${featuresHTML}
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

async function init() {
  const cardsHTML = await Promise.all(cars.map(renderCard));
  document.getElementById('cars-list').innerHTML = cardsHTML.join('');

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
}

init();

// модалки
document.addEventListener('click', e => {
  if (e.target.closest('.open-modal')) {
    e.preventDefault();
    $.fancybox.open({ src: '#modal-form', type: 'inline' });
  }
});

document.querySelector('.chat-btn').addEventListener('click', () => {
  $.fancybox.open({ src: '#modal-chat', type: 'inline' });
});

// маска телефона
document.getElementById('modal-phone').addEventListener('input', function() {
  let val = this.value.replace(/\D/g, '');
  if (val.startsWith('7') || val.startsWith('8')) val = val.slice(1);
  let result = '+7';
  if (val.length > 0) result += ' (' + val.slice(0, 3);
  if (val.length >= 3) result += ') ' + val.slice(3, 6);
  if (val.length >= 6) result += '-' + val.slice(6, 8);
  if (val.length >= 8) result += '-' + val.slice(8, 10);
  this.value = result;
});

// переключение цветов
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