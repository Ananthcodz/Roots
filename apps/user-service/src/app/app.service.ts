import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UpdateProfileDto } from '../dto/updateProfile.dto';
import {userProfileResponseDto, photoUploadResponseDto} from '@org/shared-types';
import * as sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs/promises';


@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async getUserProfileOrNull(userId: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id: userId } });
  }

  async getUserProfile(userId: number): Promise<userProfileResponseDto> {
    const user = await this.userRepository.findOne({ where: {id:userId}});

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return this.toUserProfileResponse(user);
  }

  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto): Promise<userProfileResponseDto>{
    const user = await this.userRepository.findOne({ where: {id: userId}});

    if (!user){
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if (updateProfileDto.fullName !== undefined){
      user.full_name = updateProfileDto.fullName;
    }

    if (updateProfileDto.bio !== undefined){
      user.bio = updateProfileDto.bio;
    }

    if (updateProfileDto.location !== undefined){
      user.location = updateProfileDto.location;
    }
    const updatedUser = await this.userRepository.save(user);
    return this.toUserProfileResponse(updatedUser);
  }

  async uploadProfilePhoto(){
  }

   private toUserProfileResponse(user: User): userProfileResponseDto {
    return {
      id: user.id,
      firstName:user.first_name,
      lastName:user.last_name,
      fullName: user.full_name,
      email: user.email,
      bio: user.bio,
      location: user.location,
      isGoogleSignedIn: user.is_google_signed_in,
      photoUrl: user.photo_url,
      age:user.age,
      gender:user.gender,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  }
}
