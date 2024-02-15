import { BaseController, Serialize } from '@neox-api/shared/common';

import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthDto } from '../auth/dto';
import { UserDto } from './dto';
import { IUser, IUserOmitPassword } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
@Serialize(UserDto)
@ApiTags('Users')
@ApiBearerAuth()
export class UsersController extends BaseController<IUser> {
  constructor(private readonly usersService: UsersService) {
    super(usersService);
  }

  @Post()
  create(@Body() authCredentialsDto: AuthDto): Promise<IUserOmitPassword> {
    return this.usersService.create(authCredentialsDto);
  }

  @Get()
  findAll(): Promise<IUser[]> {
    return this.usersService.findAll();
  }

  /*  @Get(':username')
		@ApiBearerAuth() // swagger
		findOne(@Param('username') username: string): Promise<Nullable<IUser>> {
		  return this.usersService.findByUsername(username);
		}*/
}
