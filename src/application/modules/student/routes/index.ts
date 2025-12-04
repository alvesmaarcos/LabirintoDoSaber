import { Router } from "express";
import { CreateStudentUseCase } from "../use-cases/create-student/create-student-use-case";
import { CreateStudentController } from "../use-cases/create-student/create-student-controller";
import { AssignEducatorUseCase } from "../use-cases/assign-educator/assign-educator-use-case";
import { AssignEducatorController } from "../use-cases/assign-educator/assign-educator-controller";
import { ListStudentsByEducatorUseCase } from "../use-cases/list-students-by-educator/list-students-by-educator-use-case";
import { ListStudentsByEducatorController } from "../use-cases/list-students-by-educator/list-students-by-educator-controller";
import { makeAuthMiddleware } from "../../../../infraestructure/middlewares";
import {
  makeEducatorRepository,
  makeStudentRepository,
} from "../../../../infraestructure/factories";

const studentRouter = Router();

const educatorRepository = makeEducatorRepository({ isMock: false });
const studentRepository = makeStudentRepository({ isMock: false });

const createStudentUseCase = new CreateStudentUseCase(
  studentRepository,
  educatorRepository
);

const assignEducatorUseCase = new AssignEducatorUseCase(
  studentRepository,
  educatorRepository
);

const listStudentByEducatorUseCase = new ListStudentsByEducatorUseCase(
  studentRepository
);

const authMiddleware = makeAuthMiddleware(educatorRepository);

studentRouter.use(authMiddleware);

studentRouter.post("/create", async (req, res) => {
  new CreateStudentController(createStudentUseCase).execute(req, res);
});

studentRouter.post("/assign-educator", async (req, res) => {
  new AssignEducatorController(assignEducatorUseCase).execute(req, res);
});

studentRouter.get("/", async (req, res) => {
  new ListStudentsByEducatorController(listStudentByEducatorUseCase).execute(
    req,
    res
  );
});

export { studentRouter };
