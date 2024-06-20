import { Repository } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { BadRequestException } from '@nestjs/common';

const findUserByUsername = async (
  userRepository: Repository<UserEntity>,
  username: string,
): Promise<UserEntity | undefined> => {
  if (!username) {
    throw new BadRequestException('O email ou alias é necessário');
  }

  return userRepository.findOne({
    where: [{ alias: username }, { email: username }],
  });
};

const checkIfUserExists = async (
  userRepository: Repository<UserEntity>,
  email?: string,
  alias?: string,
) => {
  if (email) {
    if (Boolean(await findUserByUsername(userRepository, email))) return true;
  }

  if (alias) {
    if (Boolean(await findUserByUsername(userRepository, alias))) return true;
  }

  return false;
};

export default {
  checkIfUserExists,
  findUserByUsername,
};
