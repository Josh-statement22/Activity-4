import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { GetWeatherDto } from './dto/get-weather.dto';
import { ApiOkResponse, ApiBadRequestResponse, ApiTags, ApiQuery } from '@nestjs/swagger';

@ApiTags('weather')
@Controller('weather')
export class WeatherController {
  constructor(private readonly svc: WeatherService) {}

  @Get()
  @ApiOkResponse({ description: 'Weather data fetched successfully (proxy or cached).' })
  @ApiBadRequestResponse({ description: 'Invalid query or API error.' })
  @ApiQuery({ name: 'city', required: false, example: 'Manila', description: 'City name to get weather data for.' })
  @ApiQuery({ name: 'lat', required: false, example: '14.6', description: 'Latitude coordinate.' })
  @ApiQuery({ name: 'lon', required: false, example: '121.0', description: 'Longitude coordinate.' })
  @ApiQuery({ name: 'units', required: false, example: 'metric', description: 'Units for temperature (metric or imperial).' })
  async get(@Query() query: GetWeatherDto) {
    try {
      const result = await this.svc.getWeather(query as any);
      return result;
    } catch (err: any) {
      throw new HttpException(
        { message: err.message || 'Error fetching weather' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
