import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CfpModule } from './cfp/cfp.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [CfpModule, EventsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
