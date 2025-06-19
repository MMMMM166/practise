import { ConflictException, Injectable, NotFoundException, Req } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto'; // DTO для валидации входящих данных
import { JoinRoomDto } from './dto/join-room.dto';

@Injectable()
export class RoomService {
  jwtService: any;
  constructor(private readonly prisma: PrismaService) {}

  async createRoom(roomName: string, user1Id: string) {
    return this.prisma.room.create({
      data: {
        roomName,
        user1Id,
        status: 'waiting',
        gameType: 'classic',
        isVsAi: false,
      },
      include: {
        user1: true,
      },
    });
  }

  // Присоединение к комнате (user2Id из токена)
  async joinRoom(roomId: string, user2Id: string) {
    const room = await this.prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room) throw new NotFoundException('Комната не найдена');
    if (room.status !== 'waiting') throw new ConflictException('Комната недоступна');
    if (room.user2Id) throw new ConflictException('Комната уже занята');
    if (room.user1Id === user2Id) throw new ConflictException('Нельзя присоединиться к своей комнате');

    return this.prisma.room.update({
      where: { id: roomId },
      data: {
        user2Id,
        status: 'active',
      },
      include: {
        user1: true,
        user2: true,
      },
    });
  }

  async getRooms() {
    return this.prisma.room.findMany({
      where: { status: 'waiting' },
      include: {
        user1: true,
      },
      orderBy: { startTime: 'desc' },
    });
  }
}