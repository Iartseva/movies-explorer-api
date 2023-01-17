const BASEADRESS_DEV = 'mongodb://127.0.0.1/bitfilmsdb';
const JWT_SECRET_DEV = 'dev-secret';

const regex = /(http)?s?:\/\/(www\.)?[-a-zA-Z0-9:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+\-[\].$'*,;!~#?&//=]*)/;
const resStatusCreate = 201;

const messageLogout = 'Вы вышли!';
const messageConflictError = 'Указанный e-mail уже существует в базе';
const messageValidationError = 'Указаны некорректные данные!';
const messageNotFoundError = 'Данные не найдены';
const messageForbiddenError = 'Нельзя удалять фильм другого пользователя';
const messageUnauthorizedError = 'Вы не авторизованы';

module.exports = {
  BASEADRESS_DEV,
  JWT_SECRET_DEV,
  regex,
  resStatusCreate,
  messageLogout,
  messageConflictError,
  messageValidationError,
  messageNotFoundError,
  messageForbiddenError,
  messageUnauthorizedError,
};
