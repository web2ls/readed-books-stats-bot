const validator = require('validator');

const BOOK_FIELDS_MAPPING = {
  'Автор': 'author',
  'Наименование': 'title',
  'Начали': 'started_at',
  'Закончили': 'finished_at',
  'Страницы': 'pages_amount',
  'Рейтинг': 'rating',
  'Обзор': 'review',
}

const BOOK_FIELD_VALIDATOR = {
  'author': getValidatedText,
  'title': getValidatedText,
  'started_at': getValidatedDate,
  'finished_at': getValidatedDate,
  'pages_amount': getValidatedPagesAmount,
  'rating': getValidatedRating,
  'review': getValidatedText,
}

function detectBookFieldForUpdate(value) {
  return value.split(':')[0];
}

function sanitizeValue(value) {
  return validator.escape(value);
}

function getValidatedDate(input) {
  const value = sanitizeValue(input);
  if (value === '-') {
    return null;
  }

  const dateList = value.split('.');
  console.log('current splitted date is', dateList);
  if (dateList.length !== 3 || isNaN(dateList[0]) || isNaN(dateList[1]) || isNaN(dateList[2]) || dateList[2].length !== 4) {
    return null;
  }

  return new Date(dateList[2], dateList[1] - 1, dateList[0] + 1).toISOString();
}

function getValidatedPagesAmount(input) {
  const value = sanitizeValue(input);
  if (value === '-' || isNaN(value)) {
     return 0;
  }

  return Number(value);
}

function getValidatedRating(input) {
  const value = sanitizeValue(input);
  if (value === '-' || isNaN(value) || value <= 0 || value > 5) {
    return 0;
  }

  return Number(value);
}

function getValidatedText(input) {
  const value = sanitizeValue(input);
  return value.trim();
}

function getBookIdFromMessage(value) {
  const textAsArray = value.split(' ');
  const lastEl = textAsArray[textAsArray.length - 1];
  const id = lastEl.slice(1, lastEl.length - 1);
  return isNaN(id) ? null : Number(id);
}

module.exports = {
  getValidatedDate,
  getValidatedPagesAmount,
  getValidatedRating,
  getValidatedText,
  getBookIdFromMessage,
  BOOK_FIELDS_MAPPING,
  BOOK_FIELD_VALIDATOR,
  detectBookFieldForUpdate,
}