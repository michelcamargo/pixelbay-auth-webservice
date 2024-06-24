import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { BadRequestException } from '@nestjs/common';

export class UserHelper {
  static async findUserByUsername(
    userRepository: Repository<UserEntity>,
    username: string,
    block: boolean = false,
    excluded: boolean = false,
  ): Promise<UserEntity | undefined> {
    if (!username) {
      throw new BadRequestException('O email ou alias é necessário');
    }

    return userRepository.findOne({
      where: [
        { alias: username, is_block: block, is_removed: excluded },
        { email: username, is_block: block, is_removed: excluded },
      ],
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

  static async updateLastAccess(
    userRepository: Repository<UserEntity>,
    userId: number,
    clientAddress: string,
  ) {
    await userRepository.update(userId, {
      last_address: clientAddress,
      last_login: () => 'CURRENT_TIMESTAMP',
    });

    // await userRepository
    //   .createQueryBuilder()
    //   .update()
    //   .set({
    //     last_address: clientAddress,
    //     last_login: () => 'CURRENT_TIMESTAMP',
    //   })
    //   .where('id = :id', { id: userId })
    //   .execute();
  }
}
