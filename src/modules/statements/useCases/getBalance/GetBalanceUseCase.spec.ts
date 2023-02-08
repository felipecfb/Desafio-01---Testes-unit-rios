import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase";


let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get Balance", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      usersRepositoryInMemory,
      statementsRepositoryInMemory
    );
    getBalanceUseCase = new GetBalanceUseCase(
      statementsRepositoryInMemory,
      usersRepositoryInMemory
    );
  })

  it("should be able to get a balance", async () => {
    const user: ICreateUserDTO = {
      name: "Name Test",
      email: "test@test.com.br",
      password: "12345"
    }

    const userResponse = await createUserUseCase.execute(user);

    await createStatementUseCase.execute({
      user_id: userResponse.id!,
      amount: 40,
      description: "Description test",
      type: "deposit" as OperationType
    });

    await createStatementUseCase.execute({
      user_id: userResponse.id!,
      amount: 20,
      description: "Description test",
      type: "withdraw" as OperationType
    });

    const response = await getBalanceUseCase.execute({
      user_id: userResponse.id!,
    });

    expect(response).toHaveProperty("balance");
  });

  it("should not be able to get a balance with a no existent user", () => {
    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: "fake-user-id-1234",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
