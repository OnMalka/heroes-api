import { Trainer } from "src/trainer/schemas/trainer.schema";

export class CreateHeroDto {
    readonly name: string;
    readonly ability: string;
    readonly trainer: Trainer;
    readonly suitColors: [string, string];
    readonly startingPower: number;
    readonly currentPower: number;
    readonly lastTrainings: [string, number];
    readonly imageURL: string;
}
