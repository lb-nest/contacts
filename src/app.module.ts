import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthModule } from './auth/auth.module';
import { ContactModule } from './contact/contact.module';
import { TagModule } from './tag/tag.module';

@Module({
  imports: [EventEmitterModule.forRoot(), AuthModule, ContactModule, TagModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
