import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { EventFormComponent } from './event-form.component';
import { EventService } from './event.service';

describe('EventFormComponent', () => {
  let fixture: ComponentFixture<EventFormComponent>;
  let component: EventFormComponent;
  let mockService: { createEvent: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    mockService = { createEvent: vi.fn() };
    await TestBed.configureTestingModule({
      imports: [EventFormComponent],
      providers: [provideRouter([]), { provide: EventService, useValue: mockService }],
    }).compileComponents();
    fixture = TestBed.createComponent(EventFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  const fill = () => {
    component.name.set('Tech Conf');
    component.address.set('Av. Paulista, 1000');
    component.capacity.set('200');
    component.date.set('2026-12-10');
  };

  it('renders required native-validated fields', () => {
    for (const id of ['event-name', 'event-address', 'event-capacity', 'event-date']) {
      const el: HTMLInputElement = fixture.nativeElement.querySelector('#' + id);
      expect(el).toBeTruthy();
      expect(el.required).toBe(true);
    }
  });

  it('shows success message after a valid submission', () => {
    mockService.createEvent.mockReturnValue(of({ id: '1' }));
    fill();
    component.onSubmit();
    fixture.detectChanges();
    expect(mockService.createEvent).toHaveBeenCalledWith({
      name: 'Tech Conf',
      address: 'Av. Paulista, 1000',
      capacity: 200,
      date: '2026-12-10',
    });
    expect(fixture.nativeElement.querySelector('.status-success').textContent).toContain(
      'Event registered successfully!'
    );
  });

  it('shows an error message when the request fails', () => {
    mockService.createEvent.mockReturnValue(
      throwError(() => ({ error: { message: ['capacity must not be less than 1'] } }))
    );
    fill();
    component.onSubmit();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.status-error').textContent).toContain(
      'capacity must not be less than 1'
    );
  });
});
