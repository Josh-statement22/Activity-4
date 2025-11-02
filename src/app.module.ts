import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager'; 
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { WeatherModule } from './weather/weather.module';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({
      ttl: parseInt(process.env.CACHE_TTL_SECONDS || '300', 10), // seconds
      max: 100,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/weather_proxy'),
    WeatherModule,
  ],
})
export class AppModule {}
