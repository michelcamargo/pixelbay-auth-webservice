import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { AuthUser } from '@prisma/client';
import { SignUpUserDto } from './dto/signup-user.dto';
import { SignInUserDto } from './dto/signin-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<AuthUser> {
    const user = await this.prisma.authUser.findUnique({ where: { email } });
    if (user && bcrypt.compareSync(pass, user.password)) {
      const { password: _pwd, ...userInfo } = user;
      return userInfo as AuthUser;
    }
    return null;
  }

  async login(userDto: SignInUserDto) {
    const matchedUser = await this.validateUser(userDto.email, userDto.password);

    if (!matchedUser) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    
    const { password: _pwd, id: _id, ...userInfo } = matchedUser;
    const payload = { username: matchedUser.email, sub: matchedUser.id };
    
    return {
      ...userInfo,
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(userDto: SignUpUserDto) {
    const { username, email, password } = userDto;
    const secret = bcrypt.hashSync(password, 10);
    const createdUser = await this.prisma.authUser.create({
      data: {
        name: username,
        email: email,
        password: secret,
      },
    });

    const auth = { email: createdUser.email, password: password };
    const { password: _pwd, id: _id, ...userInfo } = createdUser;

    const { access_token } = await this.login(auth);
    return { ...userInfo, access_token };
  }
}
