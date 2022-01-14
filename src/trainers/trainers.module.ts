import { Module } from '@nestjs/common';
import { TrainerService } from './trainers.service';
import { TrainerController } from './trainers.controller';
import { HeroModule } from '../heroes/heroes.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Trainer, TrainerSchema } from './schemas/trainer.schema';
import { AuthGuard } from './authGuard';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: Trainer.name,
      schema: TrainerSchema
    }]),
    HeroModule
  ],
  controllers: [TrainerController],
  providers: [TrainerService, AuthGuard]
})
export class TrainerModule { }
