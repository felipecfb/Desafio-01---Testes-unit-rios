import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get Statement Operation", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      usersRepositoryInMemory,
      statementsRepositoryInMemory
    );
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepositoryInMemory,
      statementsRepositoryInMemory
    );
  });

  it("should be able to get an statement operation", async () => {
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

    const statementOperation = await createStatementUseCase.execute(statement);

    const getStatement = await getStatementOperationUseCase.execute({
      user_id: userResponse.id!,
      statement_id: statementOperation.id!,
    })

    expect(getStatement).toHaveProperty("id");
  });

  it("should not be able to get a statement with a non existent user", async () => {
    expect(async () => {
      const statement: ICreateStatementDTO = {
        user_id: "fake-id-1234",
        amount: 30,
        description: "Description test",
        type: "deposit" as OperationType,
      };

      const statementResponse = await createStatementUseCase.execute(statement);

      await getStatementOperationUseCase.execute({
        user_id: "fake-id-1234",
        statement_id: statementResponse.id!
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to get a statement with a non existent statement", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "Name test",
        email: "test@test.com.br",
        password: "12345",
      };

      const userResponse = await createUserUseCase.execute(user);

      await getStatementOperationUseCase.execute({
        user_id: userResponse.id!,
        statement_id: "fake-statement-id-1234"
      })
    }).rejects.toBeInstanceOf(AppError);
  });
});
