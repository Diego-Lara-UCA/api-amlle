import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { UserService } from 'src/models/user/user.service';

import { LoginDto } from './dto/login.dto';
import Argon2idUtils from 'src/common/utils/argon2id.util';
import { use } from 'passport';
import { SessionType } from '../user/enums/session-type.enum';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.userService.findUserByNombreForAuth(loginDto.name);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await Argon2idUtils.Compare(loginDto.password, user.contrasena);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { sub: user.id, active: user.activo };
    const signOptions: JwtSignOptions = {};
    if (user.sessionType === SessionType.TEMPORAL) {
      signOptions.expiresIn = (user.sessionDuration || undefined) ??
        this.configService.get<string>('JWT_EXPIRATION', '1d');
    }
    const accessToken = this.jwtService.sign(payload, signOptions);

    return { accessToken };
  }
}
