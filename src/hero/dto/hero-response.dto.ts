import { SuitColors, TrainingSession } from "../schemas/hero.schema";

export class HeroResponseDto {
    firstTrained?: Date;
    imageURL: string;
    lastTrainings: TrainingSession[];
    currentPower: number;
    startingPower: number;
    suitColors: SuitColors[];
    trainer: string;
    ability: string;
    name: string;
}