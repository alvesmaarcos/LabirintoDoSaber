import { PrismaClient, Gender as PrismaGender } from "@prisma/client";
import {
  StudentRepository,
  SearchStudentProps,
} from "../../../domain/repositories/student-repository";
import { Student, Gender } from "../../../domain/entities/student";
import { Uuid } from "@wave-telecom/framework/core";
import { Educator } from "../../../domain/entities/educator";

export class StudentRepositoryImpl implements StudentRepository {
  constructor(private prismaService: PrismaClient) {}

  async save(student: Student): Promise<Student> {
    const prismaStudent = await this.prismaService.student.upsert({
      where: { id: student.id.value },
      update: {
        name: student.name,
        age: student.age,
        gender: this.mapGender(student.gender),
        zipcode: student.zipcode,
        road: student.road,
        educatorId: student.educatorId.value,
        housenumber: student.housenumber,
        phonenumber: student.phonenumber,
        learningTopics: student.learningTopics,
      },
      create: {
        educatorId: student.educatorId.value,
        id: student.id.value,
        name: student.name,
        age: student.age,
        gender: this.mapGender(student.gender),
        zipcode: student.zipcode,
        road: student.road,
        housenumber: student.housenumber,
        phonenumber: student.phonenumber,
        learningTopics: student.learningTopics,
        createdAt: student.createdAt,
      },
      include: {
        educatorStudents: {
          include: {
            educator: true,
          },
        },
      },
    });

    return this.mapToEntity(prismaStudent);
  }

  async getById(id: Uuid): Promise<Student | null> {
    const prismaStudent = await this.prismaService.student.findUnique({
      where: { id: id.value },
      include: {
        educatorStudents: {
          include: {
            educator: true,
          },
        },
      },
    });

    if (!prismaStudent) return null;

    return this.mapToEntity(prismaStudent);
  }

  async search(params: SearchStudentProps): Promise<Student[]> {
    const prismaStudents = await this.prismaService.student.findMany({
      where: {
        educatorId: params.educatorId?.value,
        id: params.id?.value,
        name: params.name
          ? { contains: params.name, mode: "insensitive" }
          : undefined,
        age: params.age,
        gender: params.gender ? this.mapGender(params.gender) : undefined,
        learningTopics: params.learningTopics
          ? { hasSome: params.learningTopics }
          : undefined,
        educatorStudents: params.educatorId
          ? { some: { educatorId: params.educatorId.value } }
          : undefined,
      },
      include: {
        educatorStudents: {
          include: {
            educator: true,
          },
        },
      },
    });

    return prismaStudents.map((student) => this.mapToEntity(student));
  }

  async delete(id: Uuid): Promise<void> {
    await this.prismaService.student.delete({
      where: { id: id.value },
    });
  }

  private mapToEntity(prismaStudent: any): Student {
    const educators: Educator[] =
      prismaStudent.educatorStudents?.map((rel: any) => ({
        id: new Uuid(rel.educator.id),
        name: rel.educator.name,
        email: rel.educator.email,
        password: rel.educator.password,
        createdAt: rel.educator.createdAt,
      })) ?? [];

    return Student.create({
      id: new Uuid(prismaStudent.id),
      name: prismaStudent.name,
      age: prismaStudent.age,
      gender: this.mapGenderFromPrisma(prismaStudent.gender),
      zipcode: prismaStudent.zipcode,
      road: prismaStudent.road,
      housenumber: prismaStudent.housenumber,
      phonenumber: prismaStudent.phonenumber,
      learningTopics: prismaStudent.learningTopics,
      createdAt: prismaStudent.createdAt,
      educators,
      educatorId: new Uuid(prismaStudent.educatorId),
    });
  }

  private mapGender(gender: Gender): PrismaGender {
    switch (gender) {
      case Gender.Male:
        return PrismaGender.male;
      case Gender.Female:
        return PrismaGender.female;
    }
  }

  private mapGenderFromPrisma(gender: PrismaGender): Gender {
    switch (gender) {
      case PrismaGender.male:
        return Gender.Male;
      case PrismaGender.female:
        return Gender.Female;
    }
  }
}
