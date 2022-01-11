import { Trainer } from "src/trainer/schemas/trainer.schema";

export class AuthenticationResponseDto {
    readonly trainer: Trainer;
    readonly token: string;
}
