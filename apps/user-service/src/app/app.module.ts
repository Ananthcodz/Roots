import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from '../entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', 'apps/user-service/.env'], // Multiple paths to search
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const password = configService.get<string>('DB_PASSWORD', '');

        console.log('🔍 Config loaded:');
        console.log('  DB_HOST:', configService.get('DB_HOST'));
        console.log('  DB_PORT:', configService.get('DB_PORT'));
        console.log('  DB_USERNAME:', configService.get('DB_USERNAME'));
        console.log('  DB_PASSWORD exists:', !!password);
        console.log('  DB_NAME:', configService.get('DB_NAME'));

        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST', 'localhost'),
          port: configService.get<number>('DB_PORT', 5432),
          username: configService.get<string>('DB_USERNAME', 'postgres'),
          password: password, // Already a string from configService
          database: configService.get<string>('DB_NAME', 'postgres'),
          entities: [User],
          synchronize: false,
          logging: false,
        };
      },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
