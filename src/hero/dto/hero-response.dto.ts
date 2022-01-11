import { Trainer } from "src/trainer/schemas/trainer.schema";

export class HeroResponseDto {
    firstTrained?: Date;
    imageURL: string;
    lastTrainings: {
        date: Date,
        percentsGained: number
    }[];
    currentPower: number;
    startingPower: number;
    suitColors: {
        item: string,
        color: string
    }[];
    trainer: Trainer;
    ability: string;
    name: string;
}