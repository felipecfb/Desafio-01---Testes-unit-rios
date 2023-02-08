import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase"
import { ICreateUserDTO } from "./ICreateUserDTO";

let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe("Create User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  })
  it("should be able to create a new user", async () => {
    const user: ICreateUserDTO = {
      name: "Test name",
      email: "test@test.com",
      password: "12345"
    }

    const response = await createUserUseCase.execute(user);

    expect(response).toHaveProperty("id");
  });

  it("should not be able to create a new user with email exists", () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "Test name",
        email: "test@test.com",
        password: "12345"
      });

      await createUserUseCase.execute({
        name: "Test name",
        email: "test@test.com",
        password: "12345"
      });
    }).rejects.toBeInstanceOf(AppError);
  });
})
