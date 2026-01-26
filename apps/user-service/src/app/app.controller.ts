import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AppService } from './app.service';
import { UpdateProfileDto } from '../dto/updateProfile.dto';
import { JwtService } from '@nestjs/jwt';
import { userProfileResponseDto, photoUploadResponseDto } from '@org/shared-types';
import {jwtGuard} from '../guards/jwt.guard';

@Controller('users')
export class AppController {
  constructor(private readonly appService: AppService,
              private readonly jwtService: JwtService
  ) {}

  @Post('generate-test-token')
  @HttpCode(HttpStatus.OK)
  async generateTestToken(@Body() body: {userId: number; email: string}) {
    const payload = {
      sub: body.userId,
      email: body.email,
    };

    const token = this.jwtService.sign(payload)

    return {
      access_token: token,
      token_type: 'Bearer',
      expires_in: '7 days',
      user: {
        id: body.userId,
        email: body.email,
      },
    };
  }


  @Get(':userId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(jwtGuard)
  async getUserProfile(@Param('userId') userId: number):Promise<userProfileResponseDto> {
    return this.appService.getUserProfile(userId);
  }

  @Put('userId/profile')
  @HttpCode(HttpStatus.OK)
  //@UseGuards(AuthGuard)
  async updateProfile(
    @Req() req: any,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<userProfileResponseDto> {
    const userId = req.user.id;
    return this.appService.updateProfile(userId, updateProfileDto);
  }
}
