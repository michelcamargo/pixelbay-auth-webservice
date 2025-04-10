import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInUserDto } from './dto/signin-user.dto';
import { PbEntity, UserEntity } from '@michelcamargo/website-shared';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserHelper } from '../users/helpers/user.helper';
import { getExpirationTime } from './helpers/auth.helper';
import { CustomersService } from '../customers/customers.service';
import { JWTHelper } from './helpers/crypto.helper';
import { JwtAuthStrategyDTO } from '../../types/jwt';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly customerService: CustomersService,
    private readonly configService: ConfigService,
    private readonly roleService: RolesService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async handshake(username: string) {
    const matchedUser = await this.userService.getByUsername(username);
    return Boolean(matchedUser);
  }

  /**
   * Gera token
   * @param userDto
   * @param clientAddress
   */
  async signIn(userDto: SignInUserDto, clientAddress: string) {
    const { username, secret } = userDto;
    const matchedUser = await this.userService.validateUserAndSecret(
      username,
      secret,
    );

    if (!matchedUser) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    if (matchedUser.isRestricted) {
      throw new UnauthorizedException('Usuário está restrito');
    }

    if (UserHelper.isRemoved(matchedUser)) {
      throw new UnauthorizedException('Usuário não registrado');
    }

    const profile = await this.roleService.getProfileName(
      matchedUser.profileId,
    );
    const customerInfo = await this.customerService.getByUserId(matchedUser.id);

    console.log({ customerInfo, profile });

    if (!profile || !customerInfo) {
      console.log('>>>>>>>>>>');

      throw new UnauthorizedException();
    }

    const matchedUsername = matchedUser.email || matchedUser.alias;

    if (!username) {
      throw new UnauthorizedException('Usuário sem identificador válido');
    }

    const payload: JwtAuthStrategyDTO = {
      username: matchedUsername,
      sub: matchedUser.id,
      // @ts-expect-error TS2322
      profile: profile as string,
      ...PbEntity.pick(matchedUser, ['alias', 'email']),
      ...PbEntity.pick(customerInfo, ['firstname', 'lastname', 'fullname']),
    };

    const expiresIn = this.configService.get<string>('JWT_EXPIRATION');
    const expirationTime = getExpirationTime(expiresIn);
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    // const jwtEncryptionKey =
    //   this.configService.get<string>('JWT_ENCRYPTION_KEY');
    // const jwtIv = this.configService.get<string>('JWT_IV');

    const token = JWTHelper.generateAccessToken(this.jwtService, payload, {
      secret: jwtSecret,
      expiresIn,
    });

    // const encryptedToken = JWTHelper.encryptToken(
    //   token,
    //   jwtEncryptionKey,
    //   jwtIv,
    // );

    await UserHelper.updateLastAccess(
      this.userRepository,
      matchedUser.id,
      clientAddress,
    );

    return {
      token,
      // token: encryptedToken,
      // refreshToken: encryptedToken,
      refreshToken: token,
      expiresIn: expirationTime,
    };
  }
}
