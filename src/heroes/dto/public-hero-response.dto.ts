export class PublicHeroResponseDto {
    readonly firstTrained?: Date;
    readonly imageURL: string;
    readonly lastTrainings: string;
    readonly currentPower: string;
    readonly startingPower: string;
    readonly suitColors: {
        readonly item: string,
        readonly color: string
    }[];
    readonly trainer: string;
    readonly ability: string;
    readonly name: string;
}
