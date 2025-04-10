import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { SignUpUserDto } from './dto/signup-user.dto';
import { UserEntity } from '@michelcamargo/website-shared';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserHelper } from './helpers/user.helper';
import { AvailabilityUserDto } from './dto/availability-user.dto';
import { isEmail, maxLength, minLength } from 'class-validator';
import ClientHelper from '../../common/helpers/client.helper';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async validateUserAndSecret(
    username: string,
    secret: string,
  ): Promise<UserEntity> {
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

  async getByUsername(username: string): Promise<UserEntity> {
    return UserHelper.findUserByUsername(this.userRepository, username);
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

  async findById(
    id: string,
    options?: { relations?: string[] },
  ): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: options?.relations || [],
    });
  }

  async excludeUser(id: string, requester: { address: string; id: string }) {
    const user = await this.userRepository.findOneBy({ id });

    if (user) {
      const timestamp = new Date()
        .toLocaleDateString('pt-BR')
        .replace(/\//g, '-');
      const newEmail = `__rm__${user.email}__rm__#${timestamp}`;
      const newAlias = `__rm__${user.alias}__rm__`;
      // anonimizar

      await this.userRepository
        .createQueryBuilder()
        .update(user)
        .set({
          isRemoved: true,
          isRestricted: true,
          email: newEmail,
          alias: newAlias,
          details: `rm_by=${requester.id}@${requester.address}#${timestamp}`,
        })
        .where('id = :id', { id })
        .execute();
    }
  }

  async createUser(userDto: SignUpUserDto) {
    const { alias, email, secret, description, profileId } = userDto;

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
      clientId: ClientHelper.CLIENT_IDS.guest,
      oauthId: 'auth0|12346',
      details: description,
      profileId: profileId ?? 1,
    });

    const created = await this.userRepository.save(user);

    return {
      id: created.id,
      alias: created.alias,
      email: created.email,
      profileId: created.profileId,
    };
  }
}
