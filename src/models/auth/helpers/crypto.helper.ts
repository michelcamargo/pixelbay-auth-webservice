import * as CryptoJS from 'crypto-js';
import { JwtService } from '@nestjs/jwt';

export type JWTTokenConfig = {
  secret: string;
  // encryptionKey: string; // Chave HEX (64 caracteres para 32 bytes)
  // iv: string; // IV HEX (32 caracteres para 16 bytes)
  expiresIn: string;
};

export class JWTHelper {
  static generateAccessToken(
    service: JwtService,
    payload: any,
    { secret, expiresIn }: JWTTokenConfig,
  ) {
    return service.sign(payload, { secret, expiresIn });
  }

  static encryptToken(
    token: string,
    encryptionKey: string,
    iv: string,
  ): string {
    if (!encryptionKey || !iv)
      throw new Error('Chave de criptografia ou IV não definido');

    // Garantir que a chave e o IV são analisados corretamente
    const key = CryptoJS.enc.Hex.parse(encryptionKey); // 32 bytes
    const ivBuffer = CryptoJS.enc.Hex.parse(iv); // 16 bytes

    const encrypted = CryptoJS.AES.encrypt(token, key, {
      iv: ivBuffer,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return encrypted.toString(); // Retorna o token criptografado como string
  }
}
