import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/models/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    const secret = configService.get<string>('JWT_SECRET');

    if (!secret) {
      throw new Error('Error de configuración: JWT_SECRET no se ha definido en el archivo .env');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }


  async validate(payload: { sub: string; rol: string }) {
    const user = await this.userService.findOneById(payload.sub);
    if (!user || !user.activo) {
        throw new UnauthorizedException('El usuario perteneciente a este token ya no existe o está inactivo.');
    }
    
    return { userId: payload.sub, role: user.rol};
  }
}