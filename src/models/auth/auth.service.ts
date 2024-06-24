import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInUserDto } from './dto/signin-user.dto';
import { PbEntity } from '../../common/entities/base.entity';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { UserHelper } from '../users/helpers/user.helper';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async signIn(userDto: SignInUserDto, clientAddress: string) {
    const { username, secret } = userDto;
    const matchedUser = await this.userService.validateUser(username, secret);

    if (!matchedUser) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = {
      username: matchedUser.email,
      sub: matchedUser.id,
      client_id: matchedUser.client_id,
      oauth_id: matchedUser.oauth_id,
    };

    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    const access_token = this.jwtService.sign(payload, { secret: jwtSecret });

    if (!access_token) {
      throw new UnauthorizedException('Falha ao gerar acesso');
    }

    await UserHelper.updateLastAccess(
      this.userRepository,
      matchedUser.id,
      clientAddress,
    );

    return {
      ...PbEntity.pick(matchedUser, ['id', 'alias', 'email', 'client_id']),
      access_token,
    };
  }
}
