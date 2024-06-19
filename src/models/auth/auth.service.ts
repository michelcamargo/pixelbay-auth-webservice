import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { SignUpUserDto } from './dto/signup-user.dto';
import { SignInUserDto } from './dto/signin-user.dto';
import { UserEntity } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PbEntity } from '../../common/entities/base.entity';
import userHelper from './helpers/user.helper';
import { AvailabilityUserDto } from './dto/availability-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async validateUser(email: string, pass: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (user && bcrypt.compareSync(pass, user.password)) {
      const { password: _pwd, ...userInfo } = user;
      return userInfo as UserEntity;
    }
    return null;
  }

  async checkUserAvailability({ email, alias }: AvailabilityUserDto) {
    return !await userHelper.checkIfUserExists(this.userRepository, email, alias);
  }

  async signIn(userDto: SignInUserDto) {
    const matchedUser = await this.validateUser(
      userDto.email,
      userDto.password,
    );

    if (!matchedUser) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = { username: matchedUser.email, sub: matchedUser.id };
    const access_token = this.jwtService.sign(payload);

    if (!access_token) {
      throw new UnauthorizedException('Falha ao gerar acesso');
    }

    const userInfo = PbEntity.pick(matchedUser, [
      'id',
      'alias',
      'email',
      'client_id',
    ]);

    return {
      ...userInfo,
      access_token,
    };
  }

  async signUp(userDto: SignUpUserDto) {
    try {
      const { alias, email, password, client_id } = userDto;

      const userAlreadyExists = await userHelper.checkIfUserExists(
        this.userRepository,
        email,
        alias,
      );

      if (userAlreadyExists) {
        throw new ConflictException('Email ou apelido já registrados.');
      }

      const secret = bcrypt.hashSync(password, 10);

      const user = this.userRepository.create({
        alias,
        email,
        password: secret,
        client_id: client_id ?? 1,
      });

      const created = await this.userRepository.save(user);

      const userInfo = PbEntity.pick(created, [
        'id',
        'alias',
        'email',
        'client_id',
      ]);

      const { access_token } = await this.signIn({ email, password });
      return { ...userInfo, access_token };
    } catch (err) {
      console.error(err);
    }
  }
}
