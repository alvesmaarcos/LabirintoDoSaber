import { AuthToken as PrismaAuthToken, PrismaClient } from "@prisma/client";
import { AuthTokenRepository } from "../../../domain/repositories/auth-token-repository";
import { Uuid } from "@wave-telecom/framework/core";
import { AuthToken } from "../../../domain/entities/auth-token";

export class AuthTokenRepositoryImpl implements AuthTokenRepository {
  constructor(private prismaService: PrismaClient) {}
  async create(authToken: AuthToken): Promise<AuthToken> {
    const prismaAuthToken = await this.prismaService.authToken.create({
      data: {
        id: Uuid.random().value,
        token: authToken.token,
        userId: authToken.userId.value,
      },
    });
    return this.mapToEntity(prismaAuthToken);
  }
  async findByUserId(userId: Uuid): Promise<AuthToken | null> {
    const prismaAuthToken = await this.prismaService.authToken.findFirst({
      where: { userId: userId.value },
    });

    if (!prismaAuthToken) {
      return null;
    }
    return this.mapToEntity(prismaAuthToken);
  }
  async update(authToken: AuthToken): Promise<void> {
    await this.prismaService.authToken.updateMany({
      where: { userId: authToken.userId.value },
      data: { token: authToken.token },
    });
  }

  private mapToEntity(authToken: PrismaAuthToken): AuthToken {
    return new AuthToken(authToken.token, new Uuid(authToken.userId));
  }
}
