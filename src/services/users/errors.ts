export class UserAlreadyExistError extends Error {
  constructor() {
    super('Já existe um usuário cadastrado com este email.')
  }
}

export class UserNotFoundError extends Error {
  constructor() {
    super('Usuário com o id fornecido não encontrado.')
  }
}
