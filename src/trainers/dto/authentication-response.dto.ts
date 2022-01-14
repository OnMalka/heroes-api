import { TrainerDocument } from "src/trainers/schemas/trainer.schema";

export class AuthenticationResponseDto {
    readonly trainer: TrainerDocument;
    readonly token: string;
}
