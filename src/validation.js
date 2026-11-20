const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST_ID_MESSAGE = 'postId doit être un entier supérieur ou égal à 1';

function isTextOfLength(value, min, max) {
  return typeof value === 'string' && value.length >= min && value.length <= max;
}

const FIELD_RULES = {
  postId: {
    isValid: (value) => Number.isInteger(value) && value >= 1,
    message: POST_ID_MESSAGE,
  },
  name: {
    isValid: (value) => isTextOfLength(value, 1, 100),
    message: 'name doit être un texte de 1 à 100 caractères',
  },
  email: {
    isValid: (value) => isTextOfLength(value, 1, 100) && EMAIL_PATTERN.test(value),
    message: 'email doit être une adresse e-mail valide de 100 caractères au plus',
  },
  body: {
    isValid: (value) => isTextOfLength(value, 1, 500),
    message: 'body doit être un texte de 1 à 500 caractères',
  },
};

function isPlainObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function findPostError(input, { partial = false } = {}) {
  if (!isPlainObject(input)) {
    return 'Le corps de la requête doit être un objet JSON';
  }

  const sentFields = Object.keys(input);
  if (sentFields.includes('id')) {
    return 'Le champ id est attribué par le serveur et ne peut pas être envoyé';
  }
  const unknownField = sentFields.find((field) => !Object.hasOwn(FIELD_RULES, field));
  if (unknownField) {
    return `Champ inconnu : ${unknownField}`;
  }
  if (partial && sentFields.length === 0) {
    return 'Au moins un champ à modifier est requis';
  }

  for (const [field, rule] of Object.entries(FIELD_RULES)) {
    if (!Object.hasOwn(input, field)) {
      if (partial) {
        continue;
      }
      return `Le champ ${field} est requis`;
    }
    if (!rule.isValid(input[field])) {
      return rule.message;
    }
  }

  return null;
}
