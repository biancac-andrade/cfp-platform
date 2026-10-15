import { Test, TestingModule } from '@nestjs/testing';
import { CfpService } from './cfp.service';
import { SpeakerDTO } from '@cfp-platform/shared-types';

describe('CfpService', () => {
  let service: CfpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CfpService],
    }).compile();

    service = module.get<CfpService>(CfpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should store and return a speaker submission with an id', () => {
    const payload: SpeakerDTO = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      talkTitle: 'Modern Angular with Signals',
      isGDE: true,
    };

    const result = service.create(payload);

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.name).toBe(payload.name);
    expect(result.email).toBe(payload.email);
    expect(result.talkTitle).toBe(payload.talkTitle);
    expect(result.isGDE).toBe(true);

    const all = service.findAll();
    expect(all).toContainEqual(result);
  });

  it('should preserve provided id when present', () => {
    const payload: SpeakerDTO = {
      id: 'custom-id-123',
      name: 'John Smith',
      email: 'john@example.com',
      talkTitle: 'Architecture at Scale',
      isGDE: false,
    };

    const result = service.submitProposal(payload);

    expect(result.id).toBe('custom-id-123');
    expect(service.findAll()).toContainEqual(result);
  });
});
