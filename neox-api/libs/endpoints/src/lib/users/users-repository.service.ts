import { BaseRepository } from '@neox-api/shared/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUser, User } from './user.entity';

/*
@Injectable()
export class UsersRepository extends BaseRepository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource);
  }

  async findAll(): Promise<IUser[]> {
    return this.find();
  }
}
*/
@Injectable()
export class UsersRepository extends BaseRepository<User> {
  constructor(
    @InjectRepository(User)
    repo: Repository<User>,
  ) {
    super(repo);
  }

  async findAll(): Promise<IUser[]> {
    return this.find();
  }
}
