function getValidatedDate(value) {
  if (value === '-') {
    return null;
  }

  const date = new Date(value).getTime();
  return isNaN(date) ? null : date;
}

function getValidatedPagesAmount(value) {
  if (value === '-' || isNaN(value)) {
     return 0;
  }

  return Number(value);
}

function getValidatedRating(value) {
  if (value === '-' || isNaN(value) || value <= 0 || value > 5) {
    return 0;
  }

  return Number(value);
}

function getValidatedText(value) {
  return value.trim();
}

module.exports = {
  getValidatedDate,
  getValidatedPagesAmount,
  getValidatedRating,
  getValidatedText,
}