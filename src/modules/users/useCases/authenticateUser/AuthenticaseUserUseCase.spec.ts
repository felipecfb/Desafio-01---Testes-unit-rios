import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe("Authenticate User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory);
  });

  it("should be able to authenticate an user", async () => {
    const user = {
      name: "Test name",
      email: "test@test.com",
      password: "12345"
    }

    await createUserUseCase.execute(user);

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    });

    expect(result).toHaveProperty("token");
  });

  it("should not be able to authenticate a non existent user", () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "fake@email.com",
        password: "1234"
      })

      await createUserUseCase.execute({
        name: "Test name",
        email: "test@test.com",
        password: "12345"
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to authenticate with incorrect password", () => {
    expect(async () => {
      const user = {
        name: "Test name",
        email: "test@test.com",
        password: "12345"
      }

      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: "test@test.com",
        password: "incorrectPassword"
      })

    }).rejects.toBeInstanceOf(AppError);
  });
})
