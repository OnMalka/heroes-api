import { Trainer } from "src/trainers/schemas/trainer.schema";

export class HeroResponseDto {
    readonly firstTrained?: Date;
    readonly imageURL: string;
    readonly lastTrainings: {
        readonly date: Date,
        readonly percentsGained: number
    }[];
    readonly currentPower: number;
    readonly startingPower: number;
    readonly suitColors: {
        readonly item: string,
        readonly color: string
    }[];
    readonly trainer: Trainer;
    readonly ability: string;
    readonly name: string;
}