function getValidatedData(value) {
  if (value === '-') {
    return null;
  }

  try {
    // FIXME: this return Nan instead null
    const date = new Date(value);
    if ('getTime' in date) {
      return date.getTime();
    } else {
      return null;
    }
  } catch {
    return null;
  }
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