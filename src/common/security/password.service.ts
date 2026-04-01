import { Injectable } from "@nestjs/common";
import { randomBytes, scrypt } from "crypto";

@Injectable()
export class PasswordService {
  private readonly keyLength = 64;
  private readonly scryptOptions = {
    N: 16384,
    r: 8,
    p: 1,
    maxmem: 64 * 1024 * 1024,
  } as const;

  async hash(password: string) {
    const salt = randomBytes(16).toString("hex");
    const derivedKey = await new Promise<Buffer>((resolve, reject) => {
      scrypt(
        password,
        salt,
        this.keyLength,
        this.scryptOptions,
        (error, key) => {
          if (error) {
            reject(error);
            return;
          }

          resolve(key as Buffer);
        },
      );
    });

    return `scrypt$${salt}$${derivedKey.toString("hex")}`;
  }
}
