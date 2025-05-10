import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateEventsDto {

  @IsOptional()
  name?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  category?: string;

  @IsNotEmpty()
  date?: Date;

  @IsOptional()
  venue?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  image?: string;
}
