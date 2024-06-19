import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { SignUpUserDto } from './dto/signup-user.dto';
import { SignInUserDto } from './dto/signin-user.dto';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async validateUser(email: string, pass: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (user && bcrypt.compareSync(pass, user.password)) {
      const { password: _pwd, ...userInfo } = user;
      return userInfo as User;
    }
    return null;
  }

  async login(userDto: SignInUserDto) {
    const matchedUser = await this.validateUser(
      userDto.email,
      userDto.password,
    );

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
    const createdUser = this.userRepository.create({
      alias: username,
      email: email,
      password: secret,
    });

    const auth = { email: createdUser.email, password: password };
    const { password: _pwd, id: _id, ...userInfo } = createdUser;

    const { access_token } = await this.login(auth);
    return { ...userInfo, access_token };
  }
}
