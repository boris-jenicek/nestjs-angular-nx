// eslint-disable-next-line @nx/enforce-module-boundaries
import { EndpointsModule, ExposedEntities } from '@neox-api/endpoints';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    EndpointsModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          ...configService.get('database'),
          entities: ExposedEntities,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
