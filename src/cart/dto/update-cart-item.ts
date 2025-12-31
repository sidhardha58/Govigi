import { IsInt, Min } from 'class-validator';

export class UpdateCartItemDto {
  @IsInt()
  @Min(0) // 👈 allow 0 to remove item
  quantity: number;
}
