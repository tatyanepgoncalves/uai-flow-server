export class LanguageNotFoundError extends Error {
  constructor() {
    super('Idioma não encontrado com o slug fornecido.')
  }
}

export class LanguageAlreadyExistError extends Error {
  constructor() {
    super('Idioma já existe no sistema.')
  }
}
