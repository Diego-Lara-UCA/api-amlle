import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/models/user/user.service';

import { LoginDto } from './dto/login.dto';
import Argon2idUtils from 'src/common/utils/argon2id.util';
import { use } from 'passport';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.userService.findUserByNombreForAuth(loginDto.name);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    
    const isPasswordValid = await Argon2idUtils.Compare(loginDto.password, user.contrasena);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // JWT payload
    const payload = { sub: user.id, active: user.activo};
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}
