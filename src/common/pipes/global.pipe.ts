import { INestApplication, ValidationPipe } from "@nestjs/common";

export class GlobalPipe {
    public static ValidationPipe(app: INestApplication) {
        app.useGlobalPipes(new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true
        }))
    }
}
