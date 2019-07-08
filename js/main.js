'use strict';

var NUMBER_OF_PHOTOS = 25;
var ESC_KEYCODE = 27;

var Comments = {
  MIN_NUMBER: 1,
  MAX_NUMBER: 3,
  TEXTS: [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ],
  AUTHORS: [
    'Илья',
    'Елена',
    'Кирилл',
    'Анастасия',
    'Андрей',
    'Мирослава'
  ],
  AVATARS: [
    'avatar-1.svg',
    'avatar-2.svg',
    'avatar-3.svg',
    'avatar-4.svg',
    'avatar-5.svg',
    'avatar-6.svg'
  ]
};

var Likes = {
  MIN_NUMBER: 15,
  MAX_NUMBER: 200
};

var Scale = {
  MIN: 0,
  MAX: 100,
  STEP: 25
};

/**
 * функция возвращает случайное число из заданного интервала
 * @param {Number} minWidth - минимальное значение
 * @param {Number} maxWidth - максимальное значение
 * @return {Number} - возвращаемое случайное число из заданного интервала
 */
var getRandomNumber = function (minWidth, maxWidth) {
  return Math.floor(Math.random() * (maxWidth - minWidth) + minWidth);
};

/**
 * функция возвращает значение случайного элемента массива
 * @param {Array} arr - массив
 * @return {String} - возращаемый случайный элемент массива
 */
var getRandomElementFromArray = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

/**
 * функция генерирует массив объектов комментариев (к одной фотографии)
 * @param {String} avatars - адрес аваторки автора
 * @param {String} texts - текст комментария
 * @param {String} authors - имя автора
 * @return {Object} - массив объектов комментариев
 */
var createComments = function (avatars, texts, authors) {
  var numberOfComments = getRandomNumber(Comments.MIN_NUMBER, Comments.MAX_NUMBER);
  var comments = [];
  for (var i = 0; i < numberOfComments; i++) {
    comments[i] = {
      avatar: getRandomElementFromArray(avatars),
      message: getRandomElementFromArray(texts),
      name: getRandomElementFromArray(authors)
    };
  }
  return comments;
};

/**
 * функция создает массив объектов фотографий с относящимися к ним комментариями
 * @param {Number} numberOfPhotos - количество фотографий
 * @param {Number} minNumberOfLikes - минимальное число лайков у фотографии
 * @param {Number} maxNumberOfLikes - максимальное число лайков у фотографии
 * @param {String} avatars - адрес аваторки автора комментария
 * @param {String} texts - текст комментария
 * @param {String} authors - имя автора комментария
 * @return {Array} - возвращаемый массив объектов фотографий
 */
var createPhotos = function (numberOfPhotos, minNumberOfLikes, maxNumberOfLikes, avatars, texts, authors) {
  var photos = [];
  for (var i = 1; i <= numberOfPhotos; i++) {
    photos[i] = {
      url: 'photos/' + i + '.jpg',
      likes: getRandomNumber(minNumberOfLikes, maxNumberOfLikes),
      comments: createComments(avatars, texts, authors)
    };
  }
  return photos;
};

var photoList = createPhotos(NUMBER_OF_PHOTOS, Likes.MIN_NUMBER, Likes.MAX_NUMBER, Comments.AVATARS, Comments.TEXTS, Comments.AUTHORS);

var pictureTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture');

/**
 * функция, создающая DOM-элемент и заполняющая его данными объекта
 * @param {Array} photo - объект с данными одной фотографии
 * @return {NodeList} - создаваемый на странице новый блок с фотографией
 */
var renderPhoto = function (photo) {
  var photoElement = pictureTemplate.cloneNode(true);
  photoElement.querySelector('.picture__img').setAttribute('src', photo.url);
  photoElement.querySelector('.picture__likes').textContent = photo.likes;

  return photoElement;
};

var fragment = document.createDocumentFragment();
photoList.forEach(function (photo) {
  fragment.appendChild(renderPhoto(photo));
});

var pictureList = document.querySelector('.pictures');
pictureList.appendChild(fragment);

/* форма добавления новой фотографии */
var imgUploadForm = document.querySelector('.img-upload__form');
var inputImgUploadFile = imgUploadForm.querySelector('#upload-file');
var popupImgUploadForm = imgUploadForm.querySelector('.img-upload__overlay');
var closeImgUploadForm = popupImgUploadForm.querySelector('#upload-cancel');

/* масштаб окна для предосмотра */
var scaleImg = imgUploadForm.querySelector('.scale');
var scaleImgInput = imgUploadForm.elements['scale'];

/* превью */
var previewImgWrap = imgUploadForm.querySelector('.img-upload__preview');
var previewImg = imgUploadForm.querySelector('.img-upload__preview').firstChild.nextSibling;

/* меню выбора эффекта*/
var effectsImg = imgUploadForm.querySelector('.effects');
var effectlevel = imgUploadForm.querySelector('.effect-level');
var effectLevelInput = imgUploadForm.querySelector('.effect-level__value');

/* шкала изменения уровня эффекта */
var effectLevelLine = imgUploadForm.querySelector('.effect-level__line');
var effectLevetPin = imgUploadForm.querySelector('.effect-level__pin');
var effectLevelDepth = imgUploadForm.querySelector('.effect-level__depth');

/* эффекты и их характеристики */
var Chrome = {
  CLASS: 'effects__preview--chrome',
  MIN: 0,
  MAX: 1
};

var Sepia = {
  CLASS: 'effects__preview--sepia',
  MIN: 0,
  MAX: 1
};

var Marvin = {
  CLASS: 'effects__preview--marvin',
  MIN: 0,
  MAX: 100,
  UNIT: '%'
};

var Phobos = {
  CLASS: 'effects__preview--phobos',
  MIN: 0,
  MAX: 3,
  UNIT: 'px'
};

var Heat = {
  CLASS: 'effects__preview--heat',
  MIN: 1,
  MAX: 3
};

/**
 * функция закрывает всплывающее окно
 */
var closePopup = function () {
  popupImgUploadForm.classList.add('hidden');
  inputImgUploadFile.value = '';
};

/**
 * функция закрывает всплывающее окно при нажатии на Esc
 * @param {Object} evt - объект события
 */
var popupEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePopup();
  }
};

/**
 * функция открывает всплывающее окно
 */
var openPopup = function () {
  popupImgUploadForm.classList.remove('hidden');

  document.addEventListener('keydown', popupEscPress);

  /* т.к. сначала фотография без фильтров, скрываем шкалу уровня фильтра и обнуляем значение поля формы */
  showEffectLevel('none');
  effectLevelInput.setAttribute('value', 0);
};

inputImgUploadFile.addEventListener('change', function () {
  openPopup();
});

closeImgUploadForm.addEventListener('click', function () {
  closePopup();
});

/**
 * функция изменяет масштаб фотографии(превью) и значение соответствующего поля
 * @param {String} direction
 */
var changeInputScale = function (direction) {
  switch (direction) {
    case 'up':
      var newValue = parseInt(scaleImgInput.value, 10) + Scale.STEP;
      if (newValue > Scale.MAX) {
        newValue = Scale.MAX;
      }
      break;
    case 'down':
      newValue = parseInt(scaleImgInput.value, 10) - Scale.STEP;
      if (newValue <= Scale.MIN) {
        newValue = Scale.MIN + Scale.STEP;
      }
      break;
  }
  scaleImgInput.setAttribute('value', newValue + '%');
  previewImgWrap.style.transform = 'scale(' + newValue / 100 + ')';
};

scaleImg.addEventListener('click', function (evt) {
  var target = evt.target;
  switch (true) {
    case (target.classList.contains('scale__control--smaller')):
      changeInputScale('down');
      break;
    case (target.classList.contains('scale__control--bigger')):
      changeInputScale('up');
      break;
  }
});

/**
 * функция показывает или скрывает шкалу с уровнем проявления эффекта
 * @param {String} effect - выбранный эффект
 */
var showEffectLevel = function (effect) {
  if (effect !== 'none') {
    if (effectlevel.classList.contains('hidden')) {
      effectlevel.classList.remove('hidden');
    }
    /* рисуем шкалу в исходном состоянии */
    /* размещаем ползунок pin */
    effectLevetPin.style.left = '100%';
    /* задаем длину depth */
    effectLevelDepth.style.width = effectLevelLine.offsetWidth + 'px';
  } else if ((effect === 'none') && !(effectlevel.classList.contains('hidden'))) {
    effectlevel.classList.add('hidden');
  }
};

/**
 * функция принимает значение - название выбранного эффекта и вносит соответствующие изменения:
 * - добавляет класс у превью (удаляя прерыдущий, если он был)
 * - меняет значение поля формы
 * @param {String} effect - выбранный эффект
 */
var changeEffect = function (effect) {
  /* удаляем текущее значение класса у превью */
  var lastEffect = previewImg.className;
  if (lastEffect) {
    previewImg.classList.remove(lastEffect);
  }

  /* устанавливаем свойства (класс, значение поля формы и наличие ползунка), соответствующие текущему эффекту */
  switch (effect) {
    case 'none':
      effectLevelInput.setAttribute('value', 0);
      break;
    case 'chrome':
      previewImg.classList.add(Chrome.CLASS);
      effectLevelInput.setAttribute('value', Chrome.MAX);
      break;
    case 'sepia':
      previewImg.classList.add(Sepia.CLASS);
      effectLevelInput.setAttribute('value', Sepia.MAX);
      break;
    case 'marvin':
      previewImg.classList.add(Marvin.CLASS);
      effectLevelInput.setAttribute('value', Marvin.MAX + Marvin.UNIT);
      break;
    case 'phobos':
      previewImg.classList.add(Phobos.CLASS);
      effectLevelInput.setAttribute('value', Phobos.MAX + Phobos.UNIT);
      break;
    case 'heat':
      previewImg.classList.add(Heat.CLASS);
      effectLevelInput.setAttribute('value', Heat.MAX);
      break;
  }
};

effectsImg.addEventListener('click', function (evt) {
  var target = evt.target;
  changeEffect(target.value);
  showEffectLevel(target.value);
});
