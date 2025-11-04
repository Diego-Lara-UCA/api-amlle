import { INestApplication } from "@nestjs/common";

export class CorsConfig {
    public static EnableCors(app: INestApplication){
        app.enableCors({
            origin: '*', // add server url
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        })
    }
}
