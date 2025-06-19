import { IsString, IsNotEmpty } from 'class-validator';

export class JoinRoomDto {
  @IsString()
  @IsNotEmpty()
  roomId: string; // ID комнаты

  @IsString()
  @IsNotEmpty()
  user2Id: string; // ID второго игрока
}