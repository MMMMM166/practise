import { Body, Controller, Get, Post, Request, UseGuards, Patch, Req, Param} from '@nestjs/common';
import { RoomService } from './room.service';
import { AuthGuard } from '@auth/guards/jwt-auth.guard';
import { CreateRoomDto } from './dto/create-room.dto';
import { JoinRoomDto } from './dto/join-room.dto';


// @Controller('room')
// export class RoomController {
//   constructor(private readonly roomService: RoomService) {}

//   @UseGuards(AuthGuard)
//   @Get('list')
//   async getList(@Request() req) {
//     return this.roomService.getList();
//   }

//   @UseGuards(AuthGuard)
//   @Post('create')
//     async createRoom(@Req() req: Request) {
//     const user = req.user as { sub: string }; // Получаем user ID из токена
//     return this.roomService.createRoom(req.body.roomName, user.sub);
//   }

//   @UseGuards(AuthGuard)
//   @Patch('join')
//   async joinRoom(@Body() joinRoomDto: JoinRoomDto) {
//     return this.roomService.joinRoom(joinRoomDto);
//   }

// }



@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @UseGuards(AuthGuard)
  @Post('create')
  async createRoom(
    @Request() req: { user: { sub: string } }, // Правильный тип для Request с user
    @Body() createRoomDto: CreateRoomDto // Используем DTO
  ) {
    return this.roomService.createRoom(createRoomDto.roomName, req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Patch(':id/join')
  async joinRoom(
    @Request() req: { user: { sub: string } },
    @Param('id') roomId: string
  ) {
    return this.roomService.joinRoom(roomId, req.user.sub);
  }

  @Get('list')
  async getRooms() {
    return this.roomService.getRooms();
  }
}