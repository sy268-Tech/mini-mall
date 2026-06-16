import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role?: string;
    tier?: string;
    totalSpent?: number;
  }

  interface Session {
    user: {
      id?: string;
      role?: string;
      tier?: string;
      totalSpent?: number;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    tier?: string;
    totalSpent?: number;
  }
}
