import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller('users')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':userId')
  @HttpCode(HttpStatus.OK)
  // @UseGuards(AuthGuard) // Uncomment when you implement authentication
  async getUserProfile(@Param('userId', ParseIntPipe) userId: number) {
    return this.appService.getUserProfile(userId);
  }
}
