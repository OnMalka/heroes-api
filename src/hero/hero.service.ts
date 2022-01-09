import { Model } from 'mongoose';
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Hero, HeroDocument } from './schemas/hero.schema';
import { CreateHeroDto } from './dto/create-Hero.dto';

@Injectable()
export class HeroService {
  constructor(@InjectModel(Hero.name) private HeroModel: Model<HeroDocument>) { }

  async create(createHeroDto: CreateHeroDto): Promise<Hero> {
    const createdHero = new this.HeroModel(createHeroDto);
    // const rss = createdHero.save();
    // console.dir(rss);

    return createdHero.save();
  }

  async train(_id: string, trainer: string): Promise<number> {
    const hero = await this.HeroModel.findOne({ _id, trainer });

    if (!hero)
      throw new NotFoundException("Hero not found");


    hero.resetLastTrainings();

    if (hero.lastTrainings.length > 4)
      throw new HttpException('Hero trained too many times', HttpStatus.TOO_MANY_REQUESTS);


    const PowerGained = hero.train();

    await hero.save();

    return PowerGained;
  }

  // async findAll(): Promise<Hero[]> {
  //   const heroes = this.HeroModel.find();
  //   return heroes;
  // }

  // async findOne(): Promise<Hero> {
  //   const hero = await this.HeroModel.findOne();
  //   hero.clearPrivateProps();

  //   return hero;
  // }
}





// @Injectable()
// export class HeroService {
//   create(createHeroDto: CreateHeroDto) {
//     return 'This action adds a new hero';
//   }

//   findHeroes(trainedBy: string) {
//     return `This action returns heroes trained by ${trainedBy}`;
//   }

//   findAll() {
//     return `This action returns all hero`;
//   }

//   update(id: number, updateHeroDto: UpdateHeroDto) {
//     return `This action updates a #${id} hero`;
//   }

//   remove(id: number) {
//     return `This action removes a #${id} hero`;
//   }
// }