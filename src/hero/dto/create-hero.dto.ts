export class CreateHeroDto {
    readonly name: string;
    readonly ability: string;
    readonly trainer: string;
    readonly suitColors: [string, number];
    readonly startingPower: number;
    readonly currentPower: number;
    readonly lastTrainings: [string, number];
    readonly imageURL: string;
}
