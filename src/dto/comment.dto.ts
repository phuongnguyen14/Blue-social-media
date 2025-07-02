import { IsString, IsOptional, MaxLength, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @MaxLength(1000)
  content: string;

  @IsOptional()
  @IsUUID()
  parentId?: string;
}

export class UpdateCommentDto {
  @IsString()
  @MaxLength(1000)
  content: string;
}

export class GetCommentsDto {
  @IsOptional()
  page?: number = 1;

  @IsOptional()
  limit?: number = 20;

  @IsOptional()
  @IsUUID()
  parentId?: string;
} 