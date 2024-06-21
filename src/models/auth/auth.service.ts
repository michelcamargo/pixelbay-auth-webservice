import {
  BadRequestException,
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
import { isEmail, maxLength, minLength } from 'class-validator';
import { CustomerEntity } from '../customers/entities/customer.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
  ) {}

  async validateUser(username: string, secret: string): Promise<UserEntity> {
    const user = await userHelper.findUserByUsername(
      this.userRepository,
      username,
    );

    if (user && bcrypt.compareSync(secret, user.password)) {
      const { password: _pwd, ...userInfo } = user;
      return userInfo as UserEntity;
    }
    return null;
  }

  async checkUserAvailability({ email, alias }: AvailabilityUserDto) {
    if (alias && alias.length && alias !== '') {
      if (!minLength(alias, 6) || !maxLength(alias, 32)) {
        throw new BadRequestException(
          'O alias (apelido) deve possuir entre 6 a 32 dígitos',
        );
      }
    }

    if (!email) {
      throw new BadRequestException('Informe o email a cadastrar');
    }

    if (!minLength(email, 8) || !maxLength(email, 63)) {
      throw new BadRequestException(
        'O email deve possuir entre 8 a 63 dígitos',
      );
    }

    if (!isEmail(email)) {
      throw new BadRequestException('Informe um email válido');
    }

    const availability = !(await userHelper.checkIfUserExists(
      this.userRepository,
      email,
      alias,
    ));

    return {
      email,
      alias,
      availability,
    };
  }

  async signIn(userDto: SignInUserDto) {
    const { username, secret } = userDto;
    const matchedUser = await this.validateUser(username, secret);

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

  async signUp(userDto: SignUpUserDto) {
    try {
      const { alias, email, secret } = userDto;

      const userAlreadyExists = await userHelper.checkIfUserExists(
        this.userRepository,
        email,
        alias,
      );

      if (userAlreadyExists) {
        throw new ConflictException('Email ou apelido já registrados.');
      }

      const password = bcrypt.hashSync(secret, 10);

      const user = this.userRepository.create({
        alias,
        email,
        password,
        client_id: 1,
        oauth_id: 10,
      });
      const created = await this.userRepository.save(user);

      const customer = this.customerRepository.create({
        user_id: created.id,
        email,
      });
      const createdCustomer = await this.customerRepository.save(customer);

      const { access_token } = await this.signIn({ username: email, secret });

      return {
        ...PbEntity.pick(created, ['id', 'alias', 'email', 'client_id']),
        customer_id: createdCustomer.id,
        access_token,
      };
    } catch (err) {
      console.error(err);
    }
  }
}
