import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

let usersRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

describe("Create statement", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      usersRepositoryInMemory,
      statementsRepositoryInMemory
    );
  });

  it("should be able to create a deposit statement", async () => {
    const user: ICreateUserDTO = {
      name: "Name test",
      email: "test@test.com.br",
      password: "12345",
    };

    const userResponse = await createUserUseCase.execute(user);

    const statement: ICreateStatementDTO = {
      user_id: userResponse.id!,
      amount: 30,
      description: "Description test",
      type: "deposit" as OperationType,
    };

    const response = await createStatementUseCase.execute(statement);

    expect(response).toHaveProperty("id");
  });

  it("should be able to create a withdraw statement", async () => {
    const user: ICreateUserDTO = {
      name: "Name test",
      email: "test@test.com.br",
      password: "12345",
    };

    const userResponse = await createUserUseCase.execute(user);

    const depositStatement: ICreateStatementDTO = {
      user_id: userResponse.id!,
      amount: 30,
      description: "Description test",
      type: "deposit" as OperationType,
    };

    await createStatementUseCase.execute(depositStatement);

    const withdrawStatement: ICreateStatementDTO = {
      user_id: userResponse.id!,
      amount: 10,
      description: "Description test",
      type: "withdraw" as OperationType,
    };

    const response = await createStatementUseCase.execute(withdrawStatement);

    expect(response).toHaveProperty("id");
  });

  it("should not be able to create a statement with a non existent user", async () => {
    expect(async () => {
      const statement: ICreateStatementDTO = {
        user_id: "fake-id-1234",
        amount: 30,
        description: "Description test",
        type: "deposit" as OperationType,
      };

      await createStatementUseCase.execute(statement);
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create a withdraw statement with balance minor this withdraw amount", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "Name test",
        email: "test@test.com.br",
        password: "12345",
      };

      const userResponse = await createUserUseCase.execute(user);

      const depositStatement: ICreateStatementDTO = {
        user_id: userResponse.id!,
        amount: 30,
        description: "Description test",
        type: "deposit" as OperationType,
      };

      await createStatementUseCase.execute(depositStatement);

      const withdrawStatement: ICreateStatementDTO = {
        user_id: userResponse.id!,
        amount: 40,
        description: "Description test",
        type: "withdraw" as OperationType,
      };

      await createStatementUseCase.execute(withdrawStatement);
    }).rejects.toBeInstanceOf(AppError);
  });
});
