export class UserAlreadyExistError extends Error {
  constructor() {
    super('Já existe um usuário cadastrado com este email.')
  }
}
