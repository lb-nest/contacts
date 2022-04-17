import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ContactModule } from './contact/contact.module';
import { TagModule } from './tag/tag.module';

@Module({
  imports: [EventEmitterModule.forRoot(), AuthModule, ContactModule, TagModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
