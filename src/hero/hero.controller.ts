import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { HeroService } from './hero.service';
import { CreateHeroDto } from './dto/create-hero.dto';
import { HeroResponseDto } from './dto/hero-response.dto';
// import { UpdateHeroDto } from './dto/update-hero.dto';

@Controller('hero')
export class HeroController {
  constructor(private readonly heroService: HeroService) { }

  @Post()
  create(@Body() createHeroDto: CreateHeroDto): Promise<HeroResponseDto> {
    return this.heroService.create(createHeroDto);
  }

  @Patch(':id')
  train(@Param('id') id: string, @Body('trainer') trainer: string): Promise<number> {
    return this.heroService.train(id, JSON.parse(trainer)._id);
  }

  // router.patch('/:id/trainings', trainHero);



  // @Get()
  // findOne() {
  //   return this.heroService.findOne();
  // }

  // @Get(':trainedBy')
  // findOne(@Param('trainedBy') trainedBy: string) {
  //   return this.heroService.findHeroes(trainedBy);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateHeroDto: UpdateHeroDto) {
  //   return this.heroService.update(+id, updateHeroDto);
  // }
}
