const validator = require('validator');

function sanitizeValue(value) {
  return validator.escape(value);
}

function getValidatedDate(input) {
  if (!input) {
    return null;
  }

  const value = sanitizeValue(input);

  return new Date(value).toISOString();
}

function convertDateToUserFormat(date) {
  const dateObj = new Date(date);

  if (isNaN(dateObj.getDate())) {
    return '-';
  }

  if (dateObj.getFullYear() === 1970) {
    return '-';
  }

  const day = dateObj.getDate();
  const month = dateObj.getMonth();
  const year = dateObj.getFullYear();

  return `${String(day).padStart(2, '0')}.${String(month + 1).padStart(2, '0')}.${year}`;
}

function getValidatedPagesAmount(input) {
  if (isNaN(input)) {
     return 0;
  }

  return Number(input);
}

function getValidatedRating(input) {
  if (isNaN(input) || input <= 0 || input > 5) {
    return 0;
  }

  return Number(input);
}

function getValidatedText(input) {
  if (!input || !input.trim()) {
    return input;
  }

  return sanitizeValue(input);
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
  convertDateToUserFormat,
}