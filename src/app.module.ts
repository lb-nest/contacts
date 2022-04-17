import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ContactModule } from './contact/contact.module';
import { TagModule } from './tag/tag.module';

@Module({
  imports: [AuthModule, ContactModule, TagModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
