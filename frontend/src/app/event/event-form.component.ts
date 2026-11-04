import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EventDTO } from '@cfp-platform/shared-types';
import { EventService } from './event.service';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.css',
})
export class EventFormComponent {
  private readonly eventService = inject(EventService);

  readonly name = signal('');
  readonly address = signal('');
  readonly capacity = signal('');
  readonly date = signal('');

  readonly isSubmitting = signal(false);
  readonly submitSuccess = signal<string | null>(null);
  readonly submitError = signal<string | null>(null);

  onInput(field: 'name' | 'address' | 'capacity' | 'date', event: Event): void {
    this[field].set((event.target as HTMLInputElement).value);
  }

  onSubmit(event?: Event): void {
    event?.preventDefault();
    if (this.isSubmitting()) return;

    this.isSubmitting.set(true);
    this.submitSuccess.set(null);
    this.submitError.set(null);

    const payload: EventDTO = {
      name: this.name().trim(),
      address: this.address().trim(),
      capacity: Number(this.capacity()),
      date: this.date(),
    };

    this.eventService.createEvent(payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.submitSuccess.set('Event registered successfully!');
        this.name.set('');
        this.address.set('');
        this.capacity.set('');
        this.date.set('');
      },
      error: (err) => {
        this.isSubmitting.set(false);
        const msg = err?.error?.message;
        this.submitError.set(
          (Array.isArray(msg) ? msg.join(', ') : msg) ||
            'Failed to register event. Please try again.'
        );
      },
    });
  }
}
