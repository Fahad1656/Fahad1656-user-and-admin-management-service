import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class userDto {
  @IsOptional()
  @IsNumber()
  senderId: number;

  @IsOptional()
  @IsNumber()
  receiverId: number;

  @IsOptional()
  @IsString()
  content: string;
}
