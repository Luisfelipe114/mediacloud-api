import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UpdateUserDto, UserResponseDto } from './dto/user.dto';
import { TokensRepository } from './repositories/tokens.repository';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UserService {
  private jwtSecret: string;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokensRepository: TokensRepository,
  ) {
    this.jwtSecret = this.getTokenSecret();
  }

  async getProfile(userId: number) {
    const user = await this.userRepository.getUser(userId);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return new UserResponseDto(user);
  }

  async updateUser({ name, username }: UpdateUserDto, userId: number) {
    const user = await this.userRepository.findUserById(userId);
    if (!user) throw new NotFoundException('Usuário não encontrado');
    if (username) {
      const usernameExists =
        await this.userRepository.findUserByUsername(username);

      const unverifiedUsernameExists =
        await this.userRepository.findUnverifiedUserByUsername(username);

      if (usernameExists?.id != userId) {
        if (usernameExists || unverifiedUsernameExists) {
          throw new ConflictException('Nome de usuário já cadastrado');
        }
      }
    }
    try {
      await this.userRepository.updateUser({ name, username }, userId);
      const accessToken = await this.generateTokens(user.name, user.id);

      const updatedUser = await this.getProfile(userId);

      const updatedUserResponse = new UserResponseDto(updatedUser);

      return { updatedUserResponse, accessToken };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async generateTokens(name: string, id: number) {
    try {
      const accessToken = jwt.sign({ name, id }, this.jwtSecret, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
      });

      return accessToken;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  private getTokenSecret() {
    if (!process.env.TOKEN_SECRET) {
      throw new Error('TOKEN_SECRET is not defined in environment variables');
    }
    return process.env.TOKEN_SECRET;
  }
}
