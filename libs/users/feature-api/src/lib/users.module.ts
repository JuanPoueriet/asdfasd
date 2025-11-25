

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity/user.entity';
import { Organization } from '@univeex/organizations/feature-api';
import { UsersService } from './users.service';

import { UsersController } from './users.controller';
import { MailModule } from '@univeex/mail/feature-api';
import { RolesModule } from '@univeex/roles/feature-api';
import { WebsocketsModule } from '@univeex/websockets/feature-api';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Organization]),
    RolesModule,
    MailModule,
    WebsocketsModule
  ],

  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
