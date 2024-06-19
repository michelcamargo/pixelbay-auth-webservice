import { Repository } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { SignUpUserDto } from '../dto/signup-user.dto';

const checkIfUserExists = async (
  userRepository: Repository<UserEntity>,
  { alias, email }: SignUpUserDto,
) => {
  return Boolean(
    Boolean(alias)
      ? await userRepository.findOne({
          where: [{ email }, { alias }],
        })
      : await userRepository.findOne({
          where: { email },
        }),
  );
};

export default {
  checkIfUserExists,
};
