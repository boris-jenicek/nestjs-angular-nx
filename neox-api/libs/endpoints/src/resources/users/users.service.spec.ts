import { DbErrorHandler } from '@neox-api/shared/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthDto } from '../../auth/dto/auth.dto';
import { IUser, User } from './user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let fakeUsersRepository: Partial<Repository<IUser>>;
  let fakeDbErrorHandler: Partial<DbErrorHandler>;

  beforeEach(async () => {
    fakeUsersRepository = {};
    fakeDbErrorHandler = {};

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        DbErrorHandler,
        {
          provide: getRepositoryToken(User),
          useValue: fakeUsersRepository,
        },
        {
          provide: DbErrorHandler,
          useValue: fakeDbErrorHandler,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user', async () => {
    const createUserDto: AuthDto = {
      email: 'testuser',
      password: 'testpassword',
    };

    const createdUser = await service.create(createUserDto);

    expect(createdUser).toBeDefined();
    expect(createdUser.email).toBe(createUserDto.email);
    expect(createdUser).not.toHaveProperty('password');
  });
});
