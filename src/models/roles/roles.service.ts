import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEntity } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RoleEntity)
    private rolesRepository: Repository<RoleEntity>,
  ) {}

  findAll() {
    return this.rolesRepository.find({ relations: ['client'] });
  }

  findOne(id: number) {
    return this.rolesRepository.findOne({
      where: { id },
      relations: ['client'],
    });
  }

  create(role: Partial<RoleEntity>) {
    const newRole = this.rolesRepository.create(role);
    return this.rolesRepository.save(newRole);
  }

  update(id: number, role: Partial<RoleEntity>) {
    return this.rolesRepository.update(id, role);
  }

  remove(id: number) {
    return this.rolesRepository.delete(id);
  }
}
