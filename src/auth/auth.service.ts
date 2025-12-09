// src/auth/auth.service.ts
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Check if user already exists
    const existingUser = await this.usersRepository.findOne({
      where: { email: registerDto.email, isDeleted: false } as any,
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create new user
    const user = this.usersRepository.create({
      email: registerDto.email,
      password: hashedPassword,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      departmentId: registerDto.departmentId,
      role: 'user', // Default role
    });

    const savedUser = await this.usersRepository.save(user);

    // Generate token
    const token = this.generateToken(savedUser);

    return {
      access_token: token,
      user: {
        id: (savedUser as any).id,
        email: savedUser.email,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        role: savedUser.role,
        departmentId: savedUser.departmentId,
      },
    };
  }

  async login(loginDto: LoginDto) {
    // Find user by email
    const user = await this.usersRepository.findOne({
      where: { email: loginDto.email, isDeleted: false } as any,
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate token
    const token = this.generateToken(user);

    return {
      access_token: token,
      user: {
        id: (user as any).id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        departmentId: user.departmentId,
      },
    };
  }

  async validateUser(userId: number): Promise<{
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    departmentId: number | null;
  }> {
    const user = await this.usersRepository.findOne({
      where: { id: userId, isDeleted: false } as any,
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    return {
      id: (user as any).id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      departmentId: user.departmentId,
    };
  }

  private generateToken(user: User): string {
    const payload = {
      sub: (user as any).id,
      email: user.email,
      role: user.role,
    };

    return this.jwtService.sign(payload);
  }
}
