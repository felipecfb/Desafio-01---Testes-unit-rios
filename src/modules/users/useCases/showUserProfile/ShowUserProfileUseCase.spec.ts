import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe("Authenticate User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory);
  });

  it("should be able to show a user profile", async () => {
    const user =  await createUserUseCase.execute({
      name: "Test name",
      email: "test@test.com",
      password: "12345"
    });

    const profile = await showUserProfileUseCase.execute(user.id!);

    expect(profile).toHaveProperty("id");
  });

  it("should not be able to show user profile with a non existent user", () => {
    expect(async () => {
      await showUserProfileUseCase.execute("fake-id-1234")
    }).rejects.toBeInstanceOf(AppError);
  });
});
