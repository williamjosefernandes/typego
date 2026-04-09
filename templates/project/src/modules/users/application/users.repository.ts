import { Injectable } from "typego";
import type { PrismaClient } from "@prisma/client";
import { TOKENS } from "../../../shared/providers/tokens";

@Injectable({ inject: [TOKENS.PRISMA_CLIENT] })
export class UsersRepository {
  constructor(private readonly prisma: PrismaClient) {}

  // Example: findAll(): Promise<User[]> {
  //   return this.prisma.user.findMany();
  // }
}
