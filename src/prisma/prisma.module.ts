// prisma.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Делаем модуль глобальным, чтобы не импортировать везде
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Экспортируем сервис
})
export class PrismaModule {}