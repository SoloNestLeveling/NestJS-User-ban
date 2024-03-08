import { ClassSerializerInterceptor, MiddlewareConsumer, Module, NestModule, RequestMethod, UseInterceptors } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModel } from './users/entity/users.entity';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AccessTokenGuared } from './auth/guard/bearer.guard';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { RolesGuard } from './users/guard/roles.guard';
import { BanModel } from './users/entity/ban.entity';
import { BanMeddleware } from './users/meddleware/ban-user.meddleware';
import { PostsModel } from './posts/entity/posts.entity';
import { LogBanMeddleware } from './users/meddleware/log-ban.meddleware';
import { BanService } from './users/ban.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BanModel,
      UsersModel

    ]),
    JwtModule.register({}),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [
        UsersModel,
        BanModel,
        PostsModel,
      ],
      synchronize: true

    }),
    UsersModule,
    PostsModule,
    CommonModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService, AuthService, BanService, {
    provide: APP_INTERCEPTOR,
    useClass: ClassSerializerInterceptor
  },
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuared,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    }
  ]
})
export class AppModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(BanMeddleware)
      .forRoutes({ path: 'ban*', method: RequestMethod.POST })
      .apply(LogBanMeddleware)
      .forRoutes({ path: 'auth*', method: RequestMethod.POST })
  }
}
