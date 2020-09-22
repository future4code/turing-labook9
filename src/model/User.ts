export class User {
  constructor(
    private id: string,
    private name: string,
    private email: string,
    private password: string,
  ) {}

  getId() {
    return this.id;
  }
  getName() {
    return this.name;
  }
  getEmail() {
    return this.email;
  }
  getPassword() {
    return this.password;
  }

  setId(id: string) {
    this.id = id;
  }
  setName(name: string) {
    this.name = name;
  }
  setEmail(email: string) {
    this.email = email;
  }
  setPassword(password: string) {
    this.password = password;
  }

  static convertToUserModel(user: any): User {
    return new User(user.id, user.name, user.email, user.password);
  }
}

export interface UserOutputDTO {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface SignupInputDTO {
  name: string;
  email: string;
  password: string;
}
