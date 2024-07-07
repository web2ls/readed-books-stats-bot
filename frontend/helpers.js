import validator from "validator";

export function isFieldEmpty(value) {
  return !Boolean(value.trim());
};

export function validateString(value) {
  if (!value) {
    return value;
  }

  return validator.escape(value);
};