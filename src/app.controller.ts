import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  // getImage() {
  //   return this.appService.getOpenAIImage();
  // }
  // getInfo() {
  //   return this.appService.getStatInfo();
  // }
  // getGglTrends() {
  //   return this.appService.getGglTrends();
  // }
  // getFB() {
  //   return this.appService.getFBCall();
  // }
  getAndDownloadImage() {
    return this.appService.getAIImage();
  }

  // getHumanityStats() {
  //   return this.appService.getHumanityStats();
  // }
}
