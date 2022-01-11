import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HeroService } from './hero.service';
import { HeroController } from './hero.controller';
import { Hero, HeroSchema } from './schemas/hero.schema';
import { Trainer, TrainerSchema } from 'src/trainer/schemas/trainer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Hero.name, schema: HeroSchema }, { name: Trainer.name, schema: TrainerSchema }])
  ],
  controllers: [HeroController],
  providers: [HeroService],
  exports: [HeroService]
})
export class HeroModule { }
