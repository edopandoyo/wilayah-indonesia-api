import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { Wilayah } from './entities/wilayah.entity';
import { WilayahPulau } from './entities/wilayah-pulau.entity';
import { WilayahPenduduk } from './entities/wilayah-penduduk.entity';
import { WilayahLuas } from './entities/wilayah-luas.entity';
import { WilayahBoundaries } from './entities/wilayah-boundaries.entity';
import { WilayahKodepos } from './entities/wilayah-kodepos.entity';
import { ProvincesModule } from './modules/provinces/provinces.module';
import { RegenciesModule } from './modules/regencies/regencies.module';
import { DistrictsModule } from './modules/districts/districts.module';
import { VillagesModule } from './modules/villages/villages.module';
import { WilayahModule } from './modules/wilayah/wilayah.module';
import { IslandsModule } from './modules/islands/islands.module';
import { BoundariesModule } from './modules/boundaries/boundaries.module';
import { KodeposModule } from './modules/kodepos/kodepos.module';
import { CacheControlInterceptor } from './common/interceptors/cache-control.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 60, // 60 requests per minute
      },
    ]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'postgres'),
        database: configService.get<string>('DB_NAME', 'wilayah_db'),
        entities: [Wilayah, WilayahPulau, WilayahPenduduk, WilayahLuas, WilayahBoundaries, WilayahKodepos],
        synchronize: false,
      }),
    }),
    ProvincesModule,
    RegenciesModule,
    DistrictsModule,
    VillagesModule,
    WilayahModule,
    IslandsModule,
    BoundariesModule,
    KodeposModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheControlInterceptor,
    },
  ],
})
export class AppModule {}
