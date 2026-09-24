export class UserContextNotFoundError extends Error {
  constructor() {
    super('Contexto do usuário não encontrado.')
    this.name = 'UserContextNotFoundError'
  }
}

export class UserContextAlreadyExistForThisLanguageError extends Error {
  constructor() {
    super('Usuário já possui contexto criado nesse idioma.')
    this.name = 'UserContextAlreadyExistForThisLanguageError'
  }
}
