// src/users/users.service.ts
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });
    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email, isDeleted: false } as any,
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id, isDeleted: false } as any,
    });
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      where: { isDeleted: false } as any,
      order: { createdAt: 'DESC' } as any,
    });
  }

  async findAllWithDeleted(): Promise<User[]> {
    return this.usersRepository.find({
      order: { createdAt: 'DESC' } as any,
    });
  }

  async findDeletedUsers(): Promise<User[]> {
    return this.usersRepository.find({
      where: { isDeleted: true } as any,
      order: { createdAt: 'DESC' } as any,
    });
  }

  async softDelete(id: number): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { id } as any,
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    (user as any).isDeleted = true;
    await this.usersRepository.save(user);
  }

  async restore(id: number): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { id, isDeleted: true } as any,
    });

    if (!user) {
      throw new NotFoundException(
        `User with ID ${id} not found or not deleted`,
      );
    }

    (user as any).isDeleted = false;
    await this.usersRepository.save(user);
  }

  async hardDelete(id: number): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
