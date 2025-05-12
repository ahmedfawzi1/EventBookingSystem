import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateEventsDto {

  @IsOptional()
  name?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  category?: string;

  @IsNotEmpty({ message: 'validations.required_field' })
  date?: Date;

  @IsOptional()
  venue?: string;

  @IsOptional()
  @IsNumber({}, { message: 'validations.invalid_price' })
  price?: number;

  @IsOptional()
  image?: string;
}
