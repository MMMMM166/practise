import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { PrismaModule } from '@prisma/prisma.module'; // Импортируем модуль, а не сервис

@Module({
  imports: [PrismaModule], // Импортируем модуль Prisma
  controllers: [RoomController],
  providers: [RoomService],
  exports: [RoomService], // Если сервис будет использоваться в других модулях
})
export class RoomModule {}