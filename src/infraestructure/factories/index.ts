import { PrismaClient } from "@prisma/client";
import { MockAuthTokenRepository } from "../repositories/mock/auth-token-repository-impl";
import { AuthTokenRepositoryImpl } from "../repositories/prisma/auth-token-repository-impl";
import { MockEducatorRepository } from "../repositories/mock/educator-repository-impl";
import { EducatorRepositoryImpl } from "../repositories/prisma/educator-repository-impl";
import { MockStudentRepository } from "../repositories/mock/student-repository-impl";
import { StudentRepositoryImpl } from "../repositories/prisma/student-repository-impl";
import { MockTaskNotebookRepository } from "../repositories/mock/task-notebook-repository-impl";
import { TaskNotebookRepositoryImpl } from "../repositories/prisma/task-notebook-repository-impl";
import { MockTaskRepository } from "../repositories/mock/task-repository-impl";
import { TaskRepositoryImpl } from "../repositories/prisma/task-repository-impl";

const prismaClient = new PrismaClient();

interface IsMock {
  isMock: boolean;
}

export const makeAuthTokenRepository = (isMock: IsMock) => {
  if (isMock.isMock) {
    return new MockAuthTokenRepository();
  }
  return new AuthTokenRepositoryImpl(prismaClient);
};

export const makeEducatorRepository = (isMock: IsMock) => {
  if (isMock.isMock) {
    return new MockEducatorRepository();
  }
  return new EducatorRepositoryImpl(prismaClient);
};

export const makeStudentRepository = (isMock: IsMock) => {
  if (isMock.isMock) {
    return new MockStudentRepository();
  }
  return new StudentRepositoryImpl(prismaClient);
};

export const makeTaskNotebookRepository = (isMock: IsMock) => {
  if (isMock.isMock) {
    return new MockTaskNotebookRepository();
  }
  return new TaskNotebookRepositoryImpl(prismaClient);
};

export const makeTaskRepository = (isMock: IsMock) => {
  if (isMock.isMock) {
    return new MockTaskRepository();
  }
  return new TaskRepositoryImpl(prismaClient);
};
