'use strict';

/**
 * Отримаємо ім'я унікального поля
 */
const getUniqueErrorMessage = (err) => {
  let output;

  try {
    let fieldName = err.message
      .substring(
        err.message.lastIndexOf('.$') + 2,
        err.message.lastIndexOf('_1')
      )
      .split(' ')
      .slice(-1)[0];

    output =
      fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' вже існує';
  } catch (ex) {
    output = 'Унікальне поле вже існує';
  }

  return output;
};

/**
 * Отримаємо повідомлення про помилку із об'єкту помилки
 */
const getErrorMessage = (err) => {
  let message = '';

  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = getUniqueErrorMessage(err);
        break;
      default:
        message = 'Щось пішло не так!';
    }
  } else {
    for (let errName in err.errors) {
      if (err.errors[errName].message) message = err.errors[errName].message;
    }
  }

  return message;
};

export default { getErrorMessage };
