import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

export interface UserProfileResponse {
  id: number;
  email: string;
  fullName: string;
  firstName: string;
  lastName: string;
  bio: string | null;
  location: string | null;
  photoUrl: string | null;
  isGoogleSignedIn: boolean;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserProfile(userId: number): Promise<UserProfileResponse> {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Return user profile (excluding sensitive data like password and token)
    return {
      id: user.id,
      email: user.email,
      fullName: user.full_name || '',
      firstName: user.first_name,
      lastName: user.last_name,
      bio: user.bio,
      location: user.location,
      photoUrl: user.photo_url,
      isGoogleSignedIn: user.is_google_signed_in || false,
      createdAt: user.created_at || new Date(),
      updatedAt: user.updated_at || new Date(),
    };
  }
}
