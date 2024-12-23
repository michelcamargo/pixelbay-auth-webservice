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
import { getExpirationTime } from './helpers/auth.helper';
import { CustomersService } from '../customers/customers.service';
import { CustomerEntity } from '../customers/entities/customer.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly customerService: CustomersService,
    private readonly configService: ConfigService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
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

    const customerInfo = await this.customerService.getByUserId(matchedUser.id);

    const payload = {
      username: matchedUser.email,
      sub: matchedUser.id,
      customer_id: customerInfo?.id,
      client_id: matchedUser.client_id,
      oauth_id: matchedUser.oauth_id,
    };

    const expiresIn = this.configService.get<string>('JWT_EXPIRATION');
    const expirationTime = getExpirationTime(expiresIn);

    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    const signedToken = this.jwtService.sign(payload, {
      secret: jwtSecret,
      expiresIn,
    });

    if (!signedToken) {
      throw new UnauthorizedException('Falha ao gerar acesso');
    }

    await UserHelper.updateLastAccess(
      this.userRepository,
      matchedUser.id,
      clientAddress,
    );

    return {
      profile: {
        ...PbEntity.pick(matchedUser, ['id', 'alias', 'email', 'client_id']),
        ...PbEntity.pick(customerInfo, ['firstname', 'lastname', 'fullname']),
        customer_id: customerInfo?.id,
      },
      auth: {
        token: signedToken,
        refreshToken: signedToken,
        expiresIn: expirationTime,
      },
    };
  }
}
