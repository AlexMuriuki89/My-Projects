// src/auth/auth.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

// Mock Request interface
interface RequestWithUser extends Request {
  user: {
    id: number;
    email: string;
    role: string;
  };
}

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    validateUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto: RegisterDto = {
        email: 'test@pesapal.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
      };

      const expectedResult = {
        access_token: 'mock-token',
        user: {
          id: 1,
          email: registerDto.email,
          firstName: registerDto.firstName,
          lastName: registerDto.lastName,
          role: 'user',
          departmentId: null,
        },
      };

      mockAuthService.register.mockResolvedValue(expectedResult);

      const result = await controller.register(registerDto);

      expect(result).toEqual(expectedResult);
      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
      expect(mockAuthService.register).toHaveBeenCalledTimes(1);
    });
  });

  describe('login', () => {
    it('should login user and return access token', async () => {
      const loginDto: LoginDto = {
        email: 'test@pesapal.com',
        password: 'Password123!',
      };

      const expectedResult = {
        access_token: 'mock-token',
        user: {
          id: 1,
          email: loginDto.email,
          firstName: 'John',
          lastName: 'Doe',
          role: 'user',
          departmentId: null,
        },
      };

      mockAuthService.login.mockResolvedValue(expectedResult);

      const result = await controller.login(loginDto);

      expect(result).toEqual(expectedResult);
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
      expect(mockAuthService.login).toHaveBeenCalledTimes(1);
    });
  });

  describe('getProfile', () => {
    it('should return current user profile', async () => {
      const mockRequest = {
        user: {
          id: 1,
          email: 'test@pesapal.com',
          role: 'user',
        },
      } as RequestWithUser;

      const expectedUser = {
        id: 1,
        email: 'test@pesapal.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'user',
        departmentId: null,
      };

      mockAuthService.validateUser.mockResolvedValue(expectedUser);

      const result = await controller.getProfile(mockRequest);

      expect(result).toEqual(expectedUser);
      expect(mockAuthService.validateUser).toHaveBeenCalledWith(1);
      expect(mockAuthService.validateUser).toHaveBeenCalledTimes(1);
    });
  });
});
