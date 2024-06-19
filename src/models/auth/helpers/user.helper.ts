import { Repository } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { SignUpUserDto } from '../dto/signup-user.dto';
import { BadRequestException } from '@nestjs/common';

const findUserByEmailOrAlias = async (
  userRepository: Repository<UserEntity>,
  email?: string,
  alias?: string,
): Promise<UserEntity | undefined> => {
  const queryBuilder = userRepository.createQueryBuilder('user');

  if (email) {
    queryBuilder.orWhere('user.email = :email', { email });
  }

  if (alias) {
    queryBuilder.orWhere('user.alias = :alias', { alias });
  }

  if (!email && !alias) {
    throw new BadRequestException('Um parâmetro (email | alias) é necessário');
  }

  return await queryBuilder.getOne();
};

const checkIfUserExists = async (
  userRepository: Repository<UserEntity>,
  email?: string,
  alias?: string,
) => {
  const user = await findUserByEmailOrAlias(userRepository, email, alias);
  return Boolean(user);
};

export default {
  checkIfUserExists,
  findUserByEmailOrAlias,
};
