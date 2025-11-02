import { Injectable, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager'; 
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { WeatherLog, WeatherLogDocument } from './schemas/weather-log.schema';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WeatherService {
  private openWeatherKey: string;
  private openWeatherUrl = 'https://api.openweathermap.org/data/2.5/weather';

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectModel(WeatherLog.name) private logModel: Model<WeatherLogDocument>,
  ) {
    this.openWeatherKey = this.config.get<string>('OPENWEATHER_API_KEY') || '';
     console.log('🔑 OpenWeather API Key:', this.openWeatherKey);
  }

  private buildCacheKey(params: Record<string, any>) {
    const sorted = Object.keys(params)
      .sort()
      .map(k => `${k}=${params[k]}`)
      .join('&');
    return `weather:${sorted}`;
  }

  async getWeather(params: { city?: string; lat?: string; lon?: string; units?: string }) {
    if (!params.city && !(params.lat && params.lon)) {
      throw new Error('Provide either city or both lat and lon');
    }

    const query: Record<string, any> = { appid: this.openWeatherKey, units: params.units || 'metric' };
    if (params.city) query.q = params.city;
    else {
      query.lat = params.lat;
      query.lon = params.lon;
    }

    const cacheKey = this.buildCacheKey(query);

    // check cache
    const cached = await this.cacheManager.get<any>(cacheKey);
    if (cached) {
      await this.logModel.create({
        query,
        provider: 'openweathermap',
        responseStatus: 200,
        cached: true,
        responseSnippet: { cached: true },
      });
      return { fromCache: true, data: cached };
    }

    // safe API call
    const resp = await firstValueFrom(this.http.get(this.openWeatherUrl, { params: query }));
    const data = resp.data;

    const ttl = parseInt(process.env.CACHE_TTL_SECONDS || '300', 10);
    await this.cacheManager.set(cacheKey, data, ttl);

    await this.logModel.create({
      query,
      provider: 'openweathermap',
      responseStatus: resp.status,
      cached: false,
      responseSnippet: {
        main: data?.main,
        weather: data?.weather?.[0],
      },
    });

    return { fromCache: false, data };
  }
}
