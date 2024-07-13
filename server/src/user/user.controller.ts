import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/decorators/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { UpdateUserDto } from './dto/user.dto';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth('jwt')
  @Get('/profile')
  getProfile(@User('id') userId: number) {
    return this.userService.getProfile(userId);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('jwt')
  @Put('/update')
  updateUser(@Body() body: UpdateUserDto, @User('id') userId: number) {
    return this.userService.updateUser(body, userId);
  }
}
