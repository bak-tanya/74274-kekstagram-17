'use strict';

var NUMBER_OF_PHOTOS = 25;

var Comments = {
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

var MIN_NUMBER_OF_LIKES = 15;
var MAX_NUMBER_OF_LIKES = 200;
var MIN_NUMBER_OF_COMMENTS = 1;
var MAX_NUMBER_OF_COMMENTS = 3;

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
  var numberOfComments = getRandomNumber(MIN_NUMBER_OF_COMMENTS, MAX_NUMBER_OF_COMMENTS);
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

var photoList = createPhotos(NUMBER_OF_PHOTOS, MIN_NUMBER_OF_LIKES, MAX_NUMBER_OF_LIKES, Comments.AVATARS, Comments.TEXTS, Comments.AUTHORS);

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
