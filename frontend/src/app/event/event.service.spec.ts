import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { EventService } from './event.service';
import { EventDTO } from '@cfp-platform/shared-types';

describe('EventService', () => {
  let service: EventService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(EventService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should POST the event to /api/events', () => {
    const dto: EventDTO = { name: 'Conf', address: 'Rua A', capacity: 10, date: '2026-12-10' };
    service.createEvent(dto).subscribe((res) => expect(res.id).toBe('1'));
    const req = http.expectOne('/api/events');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dto);
    req.flush({ id: '1', ...dto });
  });
});
