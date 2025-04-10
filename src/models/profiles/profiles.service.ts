import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfileEntity } from '@michelcamargo/website-shared';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(ProfileEntity)
    private profilesRepository: Repository<ProfileEntity>,
  ) {}

  findAll() {
    return this.profilesRepository.find({ relations: ['profile'] });
  }

  findOne(id: number) {
    return this.profilesRepository.findOne({
      where: { id },
      relations: ['client'],
    });
  }

  create(role: Partial<ProfileEntity>) {
    const newRole = this.profilesRepository.create(role);
    return this.profilesRepository.save(newRole);
  }

  update(id: number, role: Partial<ProfileEntity>) {
    return this.profilesRepository.update(id, role);
  }

  remove(id: number) {
    return this.profilesRepository.delete(id);
  }
}
