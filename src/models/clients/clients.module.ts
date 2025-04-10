import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientEntity } from '@michelcamargo/website-shared';

@Module({
  imports: [TypeOrmModule.forFeature([ClientEntity])],
})
export class ClientsModule {}
