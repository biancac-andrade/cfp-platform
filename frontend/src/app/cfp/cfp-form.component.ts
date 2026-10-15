import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CfpService } from './cfp.service';
import { SpeakerDTO } from '@cfp-platform/shared-types';

@Component({
  selector: 'app-cfp-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cfp-form.component.html',
  styleUrl: './cfp-form.component.css',
})
export class CfpFormComponent {
  private readonly cfpService = inject(CfpService);

  // Form field signals
  readonly name = signal('');
  readonly email = signal('');
  readonly talkTitle = signal('');
  readonly isGDE = signal(false);

  // Touched state signals for accessible error display
  readonly nameTouched = signal(false);
  readonly emailTouched = signal(false);
  readonly talkTitleTouched = signal(false);

  // Submission state signals
  readonly isSubmitting = signal(false);
  readonly isSubmitted = signal(false);
  readonly submitError = signal<string | null>(null);
  readonly submitSuccess = signal<string | null>(null);

  // Validation computed signals
  readonly isNameValid = computed(() => this.name().trim().length > 0);
  readonly isEmailValid = computed(() => {
    const val = this.email().trim();
    return val.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  });
  readonly isTalkTitleValid = computed(() => this.talkTitle().trim().length > 0);

  readonly isFormValid = computed(
    () => this.isNameValid() && this.isEmailValid() && this.isTalkTitleValid()
  );

  // Error message computeds
  readonly nameError = computed(() => {
    if (!this.nameTouched()) return null;
    if (!this.name().trim()) return 'Name is required.';
    return null;
  });

  readonly emailError = computed(() => {
    if (!this.emailTouched()) return null;
    if (!this.email().trim()) return 'Email is required.';
    if (!this.isEmailValid()) return 'Please enter a valid email address.';
    return null;
  });

  readonly talkTitleError = computed(() => {
    if (!this.talkTitleTouched()) return null;
    if (!this.talkTitle().trim()) return 'Talk title is required.';
    return null;
  });

  // Event handlers
  onNameInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.name.set(target.value);
  }

  onEmailInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.email.set(target.value);
  }

  onTalkTitleInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.talkTitle.set(target.value);
  }

  onGdeChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.isGDE.set(target.checked);
  }

  onBlur(field: 'name' | 'email' | 'talkTitle'): void {
    if (field === 'name') this.nameTouched.set(true);
    if (field === 'email') this.emailTouched.set(true);
    if (field === 'talkTitle') this.talkTitleTouched.set(true);
  }

  onSubmit(event?: Event): void {
    if (event) {
      event.preventDefault();
    }

    this.nameTouched.set(true);
    this.emailTouched.set(true);
    this.talkTitleTouched.set(true);

    if (!this.isFormValid() || this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);
    this.submitError.set(null);
    this.submitSuccess.set(null);

    const payload: SpeakerDTO = {
      name: this.name().trim(),
      email: this.email().trim(),
      talkTitle: this.talkTitle().trim(),
      isGDE: this.isGDE(),
    };

    this.cfpService.submitProposal(payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.isSubmitted.set(true);
        this.submitSuccess.set('Talk proposal submitted successfully!');
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.submitError.set(
          err?.error?.message || 'Failed to submit proposal. Please try again.'
        );
      },
    });
  }
}
