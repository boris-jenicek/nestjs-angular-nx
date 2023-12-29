import { BaseEntity, IBaseEntity } from '@neox-api/shared/common';
import { Nullable } from '@neox-api/shared/utils';
import { Column, Entity, OneToMany } from 'typeorm';
import { Task } from '../tasks';

export interface IUser extends IBaseEntity {
  firstName: Nullable<string>;
  lastName: Nullable<string>;
  password: string;
  username: string;
  isActive: boolean;
}

export type IUserOmitPassword = Omit<IUser, 'password'>;

export interface IUserIdentifier {
  id: string;
  password: string;
}

@Entity()
export class User extends BaseEntity implements IUser {
  @Column({ type: 'varchar', nullable: true })
  firstName: Nullable<string> = null;

  @Column({ type: 'varchar', nullable: true })
  lastName: Nullable<string> = null;

  @Column()
  password!: string;

  @Column({ unique: true })
  username!: string;

  @Column({ default: true })
  isActive!: boolean;

  @OneToMany((_type) => Task, (task) => task.user, { eager: true })
  tasks!: Task[];
}
