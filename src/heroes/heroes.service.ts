import { Model, Schema } from 'mongoose';
import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Hero, HeroDocument } from './schemas/hero.schema';
import configuration from 'config/configuration';
import axios from 'axios';
import { TrainingResponseDto } from './dto/training-response.dto';
import { HeroResponseDto } from './dto/hero-response.dto';
import { PublicHeroResponseDto } from './dto/public-hero-response.dto';
import { CreateHeroDto } from './dto/create-hero.dto';
import { TrainHeroDto } from './dto/train-hero.dto';
import { CreatedHeroDto } from './dto/created-hero.dto';
import { FindHeroesDto } from './dto/find-heroes.dto';

@Injectable()
export class HeroService {
  constructor(@InjectModel(Hero.name) private HeroModel: Model<HeroDocument>) { }

  async create(createHeroDto: CreateHeroDto): Promise<CreatedHeroDto> {

    const getRandomSuitItems = (): { item: string, color: number }[] => {
      const allowedItems = ['shoes', 'pants', 'shirt', 'hat', 'cape', 'underwear'];
      const suiteItems = [];
      for (let i = 0; i < configuration().suitItemsPerHero; i++) {
        const index = Math.round(Math.random() * allowedItems.length - 1);
        const item = allowedItems.splice(index, 1)[0];
        const color = '#' + (Math.round(Math.random() * 3839) + 256).toString(16);
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
      trainer: createHeroDto,
      trainings: []
    };

    const createdHero = new this.HeroModel(hero);

    await createdHero.save();
    return createdHero._id;
  }

  async train(trainHeroDto: TrainHeroDto): Promise<TrainingResponseDto> {
    let hero: HeroDocument;

    try {
      hero = await this.HeroModel.findOne(trainHeroDto);
    } catch (err) {
      throw new BadRequestException;
    };

    hero.resetLastTrainings();

    if (hero.lastTrainings.length > 4)
      throw new HttpException('Hero trained too many times', HttpStatus.METHOD_NOT_ALLOWED);


    const powerGained = hero.train();

    await hero.save();

    return ({ powerGained });
  }

  async findMy(findHeroesDto: FindHeroesDto): Promise<HeroResponseDto[]> {
    const { trainer } = findHeroesDto;

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

  async findAll(findHeroesDto: FindHeroesDto): Promise<PublicHeroResponseDto[]> {
    const { trainer } = findHeroesDto;

    const heroes = await this.HeroModel.find({}).sort('name');
    if (heroes.length === 0)
      return [];

    const formattedHeroes = [];

    for (let hero of heroes) {
      if (hero.trainer.toString() !== trainer._id.toString()) {
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