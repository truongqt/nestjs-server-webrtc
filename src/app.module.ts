import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatGateWay } from './common/utils/app.gateway';
import { PlayaroundController } from './playaround/playaround.controller';

@Module({
  imports: [],
  controllers: [AppController, PlayaroundController],
  providers: [AppService, ChatGateWay],
})
export class AppModule { }
