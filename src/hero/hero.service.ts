import { Model, Schema } from 'mongoose';
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Hero, HeroDocument } from './schemas/hero.schema';
import configuration from 'config/configuration';
import axios from 'axios';
import { TrainerDocument } from 'src/trainer/schemas/trainer.schema';

@Injectable()
export class HeroService {
  constructor(@InjectModel(Hero.name) private HeroModel: Model<HeroDocument>) { }

  async create(trainerId: Schema.Types.ObjectId): Promise<Hero> {

    console.log('create service');


    const getRandomSuitItems = (): { item: string, color: number }[] => {
      const allowedItems = ['shoes', 'pants', 'shirt', 'hat', 'cape', 'underwear'];
      const suiteItems = [];
      for (let i = 0; i < configuration().suitItemsPerHero; i++) {
        const index = Math.round(Math.random() * allowedItems.length - 1);
        const item = allowedItems.splice(index, 1)[0];
        const color = '#' + (Math.round(Math.random() * 4095)).toString(16);
        suiteItems.push({ item, color });
      };
      return suiteItems;
    };

    const sampleHeroId = await this.HeroModel.countDocuments({}) + 1;
    const sampleHeroData = await axios.get(`https://www.superheroapi.com/api.php/${configuration().heroApiToken}/${sampleHeroId}`);
    const sampleHeroObject = sampleHeroData.data;
    const sampleHeroesPower = sampleHeroObject.powerstats.power === 'null' ? 10 : sampleHeroObject.powerstats.power;

    const hero = {
      name: sampleHeroObject.name,
      imageURL: sampleHeroObject.image.url,
      ability: Math.random() > 0.5 ? 'attacker' : 'defender',
      suitColors: getRandomSuitItems(),
      startingPower: sampleHeroesPower,
      currentPower: sampleHeroesPower,
      trainer: trainerId,
      trainings: []
    };

    const createdHero = new this.HeroModel(hero);

    console.log('createdHero: ', createdHero);


    return await createdHero.save();
  }

  async train(_id: Schema.Types.ObjectId, trainer: Schema.Types.ObjectId): Promise<number> {
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

  async findMy(trainer: TrainerDocument): Promise<Hero[]> {
    if (trainer.heroes.length === 0)
      return [];

    await trainer.populate({
      path: 'heroes',
      options: {
        sort: {
          'currentPower': -1
        }
      }
    });

    return trainer.heroes;
  };

  async findAll(trainer?: TrainerDocument): Promise<Hero[]> {
    const heroes = await this.HeroModel.find({}).sort('name');
    if (heroes.length === 0)
      return [];

    const formattedHeroes = [];

    for (let hero of heroes) {
      if (!trainer || hero.trainer !== trainer._id) {
        hero.clearPrivateProps();
      } else {
        hero.resetLastTrainings();
        await hero.save();
      };
      formattedHeroes.push(hero);
    };

    return formattedHeroes;
  };
}