import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WeatherLogDocument = WeatherLog & Document;

@Schema({ timestamps: true })
export class WeatherLog {
  @Prop({ type: Object, required: true })
  query: any;

  @Prop({ type: String, required: true })
  provider: string;

  @Prop({ type: Number })
  responseStatus: number;

  @Prop({ type: Boolean })
  cached: boolean;

  @Prop({ type: Object })
  responseSnippet: any;
}

export const WeatherLogSchema = SchemaFactory.createForClass(WeatherLog);
