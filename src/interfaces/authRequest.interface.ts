import { Request } from "@nestjs/common";
import { TrainerDocument } from "src/trainers/schemas/trainer.schema";

export interface AuthRequestInterface extends Request {
    trainer: TrainerDocument,
    token: string
}
