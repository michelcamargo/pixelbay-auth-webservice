import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInUserDto } from './dto/signin-user.dto';
import { PbEntity } from '../../common/entities/base.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async signIn(userDto: SignInUserDto) {
    const { username, secret } = userDto;
    const matchedUser = await this.userService.validateUser(username, secret);

    if (!matchedUser) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = {
      username: username,
      sub: matchedUser.id,
      email: matchedUser.email,
      client_id: matchedUser.client_id,
      oauth_id: matchedUser.oauth_id,
    };
    const access_token = this.jwtService.sign(payload);

    if (!access_token) {
      throw new UnauthorizedException('Falha ao gerar acesso');
    }

    return {
      ...PbEntity.pick(matchedUser, ['id', 'alias', 'email', 'client_id']),
      access_token,
    };
  }
}
