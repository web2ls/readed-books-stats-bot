function getValidatedData(value) {
  if (value === '-') {
    return null;
  }

  const date = new Date(value).getTime();
  return isNaN(date) ? null : date;
}

function getValidatedPagesAmount(value) {
  if (value === '-' || isNaN(value)) {
     return null;
  }

  return Number(value);
}

function getValidatedRating(value) {
  if (value === '-' || isNaN(value)) {
    return null;
  }

  if (value <= 0 || value > 5) {
    return null;
  }

  return Number(value);
}

module.exports = {
  getValidatedData,
  getValidatedPagesAmount,
  getValidatedRating,
}