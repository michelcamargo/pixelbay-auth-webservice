import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressEntity } from '@michelcamargo/website-shared';

@Module({
  imports: [TypeOrmModule.forFeature([AddressEntity])],
})
export class AddressesModule {}
