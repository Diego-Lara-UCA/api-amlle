import { INestApplication } from "@nestjs/common";

export class CorsConfig {
    public static EnableCors(app: INestApplication){
        app.enableCors({
            origin: 'http://localhost:5173', // add server url
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            preflightContinue: true,
            optionsSuccessStatus: 204
        })
    }
}
