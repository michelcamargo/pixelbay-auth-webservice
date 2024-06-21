import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { SignUpUserDto } from './dto/signup-user.dto';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PbEntity } from '../../common/entities/base.entity';
import { UserHelper } from './helpers/user.helper';
import { AvailabilityUserDto } from './dto/availability-user.dto';
import { isEmail, maxLength, minLength } from 'class-validator';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async validateUser(username: string, secret: string): Promise<UserEntity> {
    const user = await UserHelper.findUserByUsername(
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

    const availability = !(await UserHelper.checkIfUserExists(
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

  async excludeUser(userId: number) {
    // this.userRepository.remove(userId);

    return null;
  }

  async createUser(userDto: SignUpUserDto) {
    try {
      const { alias, email, secret } = userDto;

      const userAlreadyExists = await UserHelper.checkIfUserExists(
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

      // const { access_token } = await this.signIn({ username: email, secret });

      // return {
      //   ...PbEntity.pick(created, ['id', 'alias', 'email', 'client_id']),
      //   customer_id: createdCustomer.id,
      //   access_token,
      // };

      return PbEntity.pick(created, ['id', 'alias', 'email', 'client_id']);
    } catch (err) {
      console.error(err);
    }
  }
}
