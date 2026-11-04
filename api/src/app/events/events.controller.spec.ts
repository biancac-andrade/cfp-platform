import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { EventDTO } from '@cfp-platform/shared-types';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

describe('EventsController', () => {
  let controller: EventsController;
  const pipe = new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  });
  const metadata = { type: 'body' as const, metatype: EventDTO };
  const valid = {
    name: 'Tech Conf',
    address: 'Av. Paulista, 1000',
    capacity: 200,
    date: '2026-12-10',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [EventsService],
    }).compile();
    controller = module.get(EventsController);
  });

  it('creates an event with an id and lists it', () => {
    const result = controller.create(valid as EventDTO);
    expect(result.id).toBeDefined();
    expect(controller.findAll()).toContainEqual(result);
  });

  it('accepts a valid payload', async () => {
    const out = await pipe.transform(valid, metadata);
    expect(out).toBeInstanceOf(EventDTO);
  });

  it('coerces numeric string capacity', async () => {
    const out = await pipe.transform({ ...valid, capacity: '50' }, metadata);
    expect(out.capacity).toBe(50);
  });

  it.each([
    ['missing name', { ...valid, name: undefined }],
    ['missing address', { ...valid, address: '' }],
    ['zero capacity', { ...valid, capacity: 0 }],
    ['invalid date', { ...valid, date: 'not-a-date' }],
    ['extra property', { ...valid, extra: 'x' }],
  ])('rejects %s', async (_label, payload) => {
    await expect(pipe.transform(payload, metadata)).rejects.toThrow(BadRequestException);
  });
});
