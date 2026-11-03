import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { CfpService } from './cfp.service';
import { SpeakerDTO } from '@cfp-platform/shared-types';

describe('CfpService', () => {
  let service: CfpService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CfpService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(CfpService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should submit proposal via POST /api/cfp', () => {
    const mockProposal: SpeakerDTO = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      talkTitle: 'Building Accessible Angular Apps with Signals',
      isGDE: true,
    };

    const mockResponse: SpeakerDTO = {
      id: '123-abc',
      ...mockProposal,
    };

    service.submitProposal(mockProposal).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne('/api/cfp');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockProposal);

    req.flush(mockResponse);
  });

  it('should retrieve proposals via GET /api/cfp', () => {
    const mockProposals: SpeakerDTO[] = [
      {
        id: '1',
        name: 'Jane Doe',
        email: 'jane@example.com',
        talkTitle: 'Building Accessible Angular Apps with Signals',
        isGDE: true,
      },
      {
        id: '2',
        name: 'John Smith',
        email: 'john@example.com',
        talkTitle: 'State of NestJS',
        isGDE: false,
      },
    ];

    service.getProposals().subscribe((res) => {
      expect(res).toEqual(mockProposals);
      expect(res.length).toBe(2);
    });

    const req = httpTestingController.expectOne('/api/cfp');
    expect(req.request.method).toBe('GET');

    req.flush(mockProposals);
  });
});
