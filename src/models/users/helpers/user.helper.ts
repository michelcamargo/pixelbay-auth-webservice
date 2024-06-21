import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { BadRequestException } from '@nestjs/common';

export class UserHelper {
  static async findUserByUsername(
    userRepository: Repository<UserEntity>,
    username: string,
  ): Promise<UserEntity | undefined> {
    if (!username) {
      throw new BadRequestException('O email ou alias é necessário');
    }

    return userRepository.findOne({
      where: [{ alias: username }, { email: username }],
    });
  }

  static async checkIfUserExists(
    userRepository: Repository<UserEntity>,
    email?: string,
    alias?: string,
  ) {
    if (email) {
      if (Boolean(await this.findUserByUsername(userRepository, email)))
        return true;
    }

    if (alias) {
      if (Boolean(await this.findUserByUsername(userRepository, alias)))
        return true;
    }

    return false;
  }
}
