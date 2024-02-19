import { NotFoundException } from '@nestjs/common';
import { MESSAGE } from '../constants';
import { Nullable } from '../types';
import { BaseRepository } from './base.repository';

export abstract class BaseEntityService<EntityInterface, CreateDto, UpdateDto> {
  protected constructor(private repository: BaseRepository<any>) {}

  async findAll(): Promise<EntityInterface[]> {
    return this.repository.find();
  }

  async findById(id: string): Promise<EntityInterface> {
    const entity = await this.repository.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException(
        MESSAGE.ERROR.ENTITY_WITH_ID_DOES_NOT_EXIST(id),
      );
    }
    return entity;
  }
  async create<T = CreateDto>(createDto: CreateDto): Promise<T> {
    const entity = this.repository.create(createDto);
    return this.repository.save(entity);
  }

  async update(id: string, updateDto: UpdateDto): Promise<EntityInterface> {
    const entity = await this.repository.findOneBy({ id: id });
    if (!entity) {
      throw new NotFoundException(
        MESSAGE.ERROR.ENTITY_WITH_ID_DOES_NOT_EXIST(id),
      );
    }
    this.repository.merge(entity, updateDto);
    return this.repository.save(entity);
  }

  findOneBy(
    partialItem: Partial<EntityInterface>,
  ): Promise<Nullable<EntityInterface>> {
    return this.repository.findOneBy(partialItem as object);
  }

  async remove(id: string): Promise<void> {
    const result = await this.repository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(
        MESSAGE.ERROR.ENTITY_WITH_ID_DOES_NOT_EXIST(id),
      );
    }
  }
}
