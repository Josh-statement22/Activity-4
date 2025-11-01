import { IsOptional, IsString, IsIn, IsNumberString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetWeatherDto {
  @ApiPropertyOptional({ description: 'City name (e.g., Manila)' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'Latitude' })
  @IsOptional()
  @IsNumberString()
  lat?: string;

  @ApiPropertyOptional({ description: 'Longitude' })
  @IsOptional()
  @IsNumberString()
  lon?: string;

  @ApiPropertyOptional({ description: 'units: standard, metric, imperial' })
  @IsOptional()
  @IsIn(['standard', 'metric', 'imperial'])
  units?: 'standard' | 'metric' | 'imperial';
}
