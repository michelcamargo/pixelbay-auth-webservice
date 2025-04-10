import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileEntity } from '@michelcamargo/website-shared';
import { ProfilesService } from './profiles.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProfileEntity])],
  controllers: [],
  providers: [],
  exports: [ProfilesService],
})
export class ProfilesModule {}
