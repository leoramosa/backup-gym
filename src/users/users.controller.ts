import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
  Req,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { Request } from 'express';
import { Response } from 'express';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/seed')
  @ApiOperation({ summary: 'Seed users' })
  async seedUsers() {
    try {
      await this.usersService.seedUsers();
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error al cargar usuarios.');
    }
    return { message: 'Usuarios cargados correctamente.' };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  @Get('/logout')
  logout(@Res() res: Response) {
    // Redirigir al usuario al logout de Auth0
    // const auth0LogoutUrl = `https://${process.env.AUTH0_DOMAIN}/v2/logout?client_id=${process.env.AUTH0_CLIENT_ID}&returnTo=${process.env.POST_LOGOUT_REDIRECT_URI}`;
    const auth0LogoutUrl = `https://${process.env.AUTH0_DOMAIN}/v2/logout?client_id=${process.env.AUTH0_CLIENT_ID}&returnTo=${process.env.POST_LOGOUT_REDIRECT_URI}`;

    // Redirigir al usuario a la URL de logout de Auth0
    return res.redirect(auth0LogoutUrl);
  }

  @Get()
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 5,
    description: 'Limite de items por página',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
    description: 'Número de página',
  })
  @ApiOperation({ summary: 'Retrieve all users' })
  findAll(@Query('limit') limit: number = 5, @Query('page') page: number = 1) {
    return this.usersService.findAll(limit, page);
  }

  @Get('/byFilters')
  @ApiOperation({
    summary:
      'Retrieve all users that match with criteria, name,lastname,birthday,isadmin,email, example: users/byFilters?email=myemail@mail.com&name=jhon&isadmin=true',
  })
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiQuery({ name: 'lastname', required: false, type: String })
  @ApiQuery({ name: 'birthday', required: false, type: String })
  @ApiQuery({ name: 'isadmin', required: false, type: Boolean })
  @ApiQuery({ name: 'email', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAllByFilters(
    @Query('name') name?: string,
    @Query('lastname') lastname?: string,
    @Query('birthday') birthday?: string,
    @Query('isadmin') isadmin?: Boolean,
    @Query('email') email?: string,
    @Query('page') page: number = 1, // Página por defecto es 1
    @Query('limit') limit: number = 10, // Límite por defecto es 10
  ): Promise<{ data: UserEntity[]; count: number }> {
    if (!name && !lastname && !birthday && !isadmin && !email) {
      throw new BadRequestException(
        'At least one filter must be provided, example /users/byFilters?name=John&email=john@example.com&page=2&limit=5',
      );
    }
    return this.usersService.findAllByFilters(
      { name, lastname, birthday, isadmin, email },
      page,
      limit,
    );
  }
  /*
  @Get('/auth1')
  loginWhitAuth0(@Req() req : Request) {
    console.log(req.oidc.user);
   console.log('El estado de req.oidc.isAuthenticated() en users.controller.ts es '+req.oidc.isAuthenticated());
    return req.oidc.isAuthenticated() ? 'Logged in' : 'Not logged in';
  }*/
  @Get(':id')
  @ApiOperation({
    summary:
      'Retrieve an specific user by id (UUID), example: 06b715e7-8b21-4398-a610-940e473f95e9',
  })
  // @ApiParam({ name: 'id', type: 'uuid' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary:
      'Update an specific user by id (UUID), example: 06b715e7-8b21-4398-a610-940e473f95e9 in param, and body, see example value below',
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary:
      'Delete an specific user by id (UUID), example: 06b715e7-8b21-4398-a610-940e473f95e9 in param',
  })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id); // dato interesante, si se le coloca +id, el "+" lo convierte a number
  }
}
