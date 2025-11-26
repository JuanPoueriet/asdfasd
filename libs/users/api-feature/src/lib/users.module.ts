

import { Module } from '@nestjs/common';
import { UsersDataAccessModule } from '@univeex/users/backend/data-access';
import { UsersApplicationService } from './users.application.service';
import { UsersController } from './users.controller';
import { MailModule } from '@univeex/mail/feature-api';
import { RolesModule } from '@univeex/roles/feature-api';
import { WebsocketsModule } from '@univeex/websockets/feature-api';

@Module({
  imports: [
    UsersDataAccessModule,
    RolesModule,
    MailModule,
    WebsocketsModule
  ],
  controllers: [UsersController],
  providers: [UsersApplicationService],
})
export class UsersModule {}
