import { ILike, Repository } from 'typeorm';
import { UserEntity } from '@michelcamargo/website-shared';
import { BadRequestException } from '@nestjs/common';

export class UserHelper {
  static async findUserByUsername(
    userRepository: Repository<UserEntity>,
    username: string,
    excluded: boolean = false,
  ): Promise<UserEntity | undefined> {
    if (!username) {
      throw new BadRequestException('O email ou alias é necessário');
    }

    return userRepository.findOne({
      where: [
        { alias: ILike(username), isRemoved: excluded },
        { email: ILike(username), isRemoved: excluded },
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
    userId: string,
    clientAddress: string,
  ) {
    await userRepository.update(userId, {
      lastAddress: clientAddress,
      lastLogin: () => 'CURRENT_TIMESTAMP',
    });

    // await userRepository
    //   .createQueryBuilder()
    //   .update()
    //   .set({
    //     lastAddress: clientAddress,
    //     lastLogin: () => 'CURRENT_TIMESTAMP',
    //   })
    //   .where('id = :id', { id: userId })
    //   .execute();
  }

  static isRemoved(user: UserEntity): boolean {
    return (
      user.isRemoved ||
      user.email.includes('__rem') ||
      user.email.includes('rem__') ||
      user.alias.includes('rem__') ||
      user.alias.includes('__rem')
    );
  }
}
