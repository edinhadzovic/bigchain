module.exports = {
  ERR_NOT_VALID_EMAIL: {
    success: false,
    message: 'Email is not a valid email.',
    type: 'ERR_NOT_VALID_EMAIL'
  },
  ERR_PASSWORD_WRONG: {
    success: false,
    message: 'Password is wrong.',
    type: 'ERR_PASSWORD_WRONG'
  },
  ERR_DB_READING: {
    success: false,
    message: 'There was an error in reading the DataBase.',
    type: 'ERR_DB_READING'
  },
  ERR_EMAIL_FIELD_EMPTY: {
    success: false,
    message: 'Email field is empty.',
    type: 'ERR_EMAIL_FIELD_EMPTY'
  },
  ERR_PASSWORD_FIELD_EMPTY: {
    success: false,
    message: 'Password field is empty.',
    type: 'ERR_PASSWORD_FIELD_EMPTY'
  },
  ERR_PASSWORD_REP_FIELD_EMPTY: {
    success: false,
    message: 'Password not confirmed.',
    type: 'ERR_PASSWORD_REP_FIELD_EMPTY'
  },
  ERR_PASSWORD_TO_SHORT: {
    success: false,
    message: 'Password has to be 8-15 digit long.',
    type: 'ERR_PASSWORD_TO_SHORT'
  },
  ERR_PASSWORD_DO_NOT_MATCH: {
    success: false,
    message: 'Passwords do not match.',
    type: 'ERR_PASSWORD_DO_NOT_MATCH'
  },
  ERR_PASSWORD_TO_SIMPLE: {
    success: false,
    message: 'Password has to contain 1 number, 1 special sign, 1 upper case letter.',
    type: 'ERR_PASSWORD_TO_SIMPLE'
  },
  ERR_EMAIL_TAKEN: {
    success: false,
    message: 'There is already a user with this email.',
    type: 'ERR_EMAIL_TAKEN'
  },
  ERR_FIRST_NAME_MISSING: {
    success: false,
    message: 'First name field is empty.',
    type: 'ERR_FIRST_NAME_MISSING'
  },
  ERR_LAST_NAME_MISSING: {
    success: false,
    message: 'Last name field is empty.',
    type: 'ERR_LAST_NAME_MISSING'
  },
  ERR_PHONE_MISSING: {
    success: false,
    message: 'Phone field is empty.',
    type: 'ERR_PHONE_MISSING'
  },
  ERR_BIRTHDAY_MISSING: {
    success: false,
    message: 'Birthday field is empty.',
    type: 'ERR_BIRTHDAY_MISSING'
  },
};