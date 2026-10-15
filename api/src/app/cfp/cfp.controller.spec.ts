import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { CfpController } from './cfp.controller';
import { CfpService } from './cfp.service';
import { SpeakerDTO } from '@cfp-platform/shared-types';

describe('CfpController', () => {
  let controller: CfpController;
  let service: CfpService;
  let validationPipe: ValidationPipe;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CfpController],
      providers: [CfpService],
    }).compile();

    controller = module.get<CfpController>(CfpController);
    service = module.get<CfpService>(CfpService);

    validationPipe = new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create endpoint', () => {
    it('should submit proposal and return created speaker record', () => {
      const payload: SpeakerDTO = {
        name: 'Alice Expert',
        email: 'alice@example.com',
        talkTitle: 'Fullstack NestJS & Angular',
        isGDE: false,
      };

      const result = controller.create(payload);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.name).toBe(payload.name);
      expect(result.email).toBe(payload.email);
    });

    it('should return all proposals via findAll', () => {
      const payload: SpeakerDTO = {
        name: 'Bob Speaker',
        email: 'bob@example.com',
        talkTitle: 'Clean Architecture',
        isGDE: true,
      };

      controller.create(payload);
      const results = controller.findAll();

      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results.some((r) => r.name === 'Bob Speaker')).toBe(true);
    });
  });

  describe('ValidationPipe with SpeakerDTO', () => {
    const metadata = { type: 'body' as const, metatype: SpeakerDTO };

    it('should accept a valid payload', async () => {
      const validPayload = {
        name: 'Alice Expert',
        email: 'alice@example.com',
        talkTitle: 'Building Scalable Apps',
        isGDE: true,
      };

      const transformed = await validationPipe.transform(validPayload, metadata);
      expect(transformed).toBeInstanceOf(SpeakerDTO);
      expect(transformed.name).toBe('Alice Expert');
      expect(transformed.email).toBe('alice@example.com');
      expect(transformed.talkTitle).toBe('Building Scalable Apps');
      expect(transformed.isGDE).toBe(true);
    });

    it('should throw BadRequestException when required fields are missing', async () => {
      const missingName = {
        email: 'alice@example.com',
        talkTitle: 'Building Scalable Apps',
        isGDE: true,
      };

      await expect(validationPipe.transform(missingName, metadata)).rejects.toThrow(
        BadRequestException
      );
    });

    it('should throw BadRequestException when email is malformed', async () => {
      const invalidEmail = {
        name: 'Alice Expert',
        email: 'not-an-email',
        talkTitle: 'Building Scalable Apps',
        isGDE: true,
      };

      await expect(validationPipe.transform(invalidEmail, metadata)).rejects.toThrow(
        BadRequestException
      );
    });

    it('should throw BadRequestException when extra unwhitelisted fields are provided', async () => {
      const extraField = {
        name: 'Alice Expert',
        email: 'alice@example.com',
        talkTitle: 'Building Scalable Apps',
        isGDE: true,
        unexpectedProperty: 'malicious-data',
      };

      await expect(validationPipe.transform(extraField, metadata)).rejects.toThrow(
        BadRequestException
      );
    });
  });
});
