import { UserDto } from '../../dto/interfaces.ts';

export type UserAuthType = Omit<UserDto, 'boards'> & {
    refreshTokenVersion: number;
};
