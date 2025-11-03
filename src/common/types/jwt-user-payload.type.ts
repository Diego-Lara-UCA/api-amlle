import { Role } from 'src/models/user/enums/role.enum';

export type JwtUserPayload = {
  userId: string;

  role: Role;
};
