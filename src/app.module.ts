import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TrainerModule } from './trainer/trainer.module';
import { HeroModule } from './hero/hero.module';
import configuration from '../config/configuration';

@Module({
  imports: [
    // ConfigModule.forRoot({
    //   // envFilePath: 'development.env',
    //   // load: [configuration],
    //   // isGlobal: true
    // }),
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      'mongodb+srv://abudahka:tuiKrvvZ60cmGSF4@cluster0.rhtjb.mongodb.net/heroes-db?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useCreateIn  dex: true,
      }
    ),
    // MongooseModule.forRoot(
    //   // 'mongodb+srv://abudahka:tuiKrvvZ60cmGSF4@cluster0.rhtjb.mongodb.net/heroes-db?retryWrites=true&w=majority',
    //   configuration.dbURI,
    //   {
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true
    //   }),
    TrainerModule,
    HeroModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
