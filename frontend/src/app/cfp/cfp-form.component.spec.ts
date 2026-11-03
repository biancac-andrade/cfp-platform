import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { CfpFormComponent } from './cfp-form.component';
import { CfpService } from './cfp.service';
import { SpeakerDTO } from '@cfp-platform/shared-types';

describe('CfpFormComponent', () => {
  let component: CfpFormComponent;
  let fixture: ComponentFixture<CfpFormComponent>;
  let mockCfpService: {
    submitProposal: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    mockCfpService = {
      submitProposal: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [CfpFormComponent],
      providers: [
        provideRouter([]),
        {
          provide: CfpService,
          useValue: mockCfpService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CfpFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Initial Signal State and Submit Button', () => {
    it('should have empty initial signal values and isFormValid() === false', () => {
      expect(component.name()).toBe('');
      expect(component.email()).toBe('');
      expect(component.talkTitle()).toBe('');
      expect(component.isGDE()).toBe(false);
      expect(component.isSubmitting()).toBe(false);
      expect(component.isSubmitted()).toBe(false);
      expect(component.submitError()).toBeNull();
      expect(component.submitSuccess()).toBeNull();

      expect(component.isNameValid()).toBe(false);
      expect(component.isEmailValid()).toBe(false);
      expect(component.isTalkTitleValid()).toBe(false);
      expect(component.isFormValid()).toBe(false);
    });

    it('should have submit button disabled on initial load', () => {
      const submitBtn: HTMLButtonElement = fixture.nativeElement.querySelector(
        '#submit-proposal-btn'
      );
      expect(submitBtn).toBeTruthy();
      expect(submitBtn.disabled).toBe(true);
      expect(submitBtn.getAttribute('aria-disabled')).toBe('true');
    });
  });

  describe('Form Validation and Button Enabling', () => {
    it('should enable submit button when all required fields become valid', () => {
      const submitBtn: HTMLButtonElement = fixture.nativeElement.querySelector(
        '#submit-proposal-btn'
      );
      expect(submitBtn.disabled).toBe(true);

      // Populate valid data
      component.name.set('Jane Doe');
      component.email.set('jane.doe@example.com');
      component.talkTitle.set('Angular Signals & WAI-ARIA Form Validation');
      component.isGDE.set(true);

      fixture.detectChanges();

      expect(component.isNameValid()).toBe(true);
      expect(component.isEmailValid()).toBe(true);
      expect(component.isTalkTitleValid()).toBe(true);
      expect(component.isFormValid()).toBe(true);

      expect(submitBtn.disabled).toBe(false);
      expect(submitBtn.getAttribute('aria-disabled')).toBe('false');
    });

    it('should remain disabled when email format is invalid', () => {
      component.name.set('Jane Doe');
      component.email.set('invalid-email-string');
      component.talkTitle.set('Talk Title');
      fixture.detectChanges();

      expect(component.isNameValid()).toBe(true);
      expect(component.isEmailValid()).toBe(false);
      expect(component.isFormValid()).toBe(false);

      const submitBtn: HTMLButtonElement = fixture.nativeElement.querySelector(
        '#submit-proposal-btn'
      );
      expect(submitBtn.disabled).toBe(true);
    });

    it('should update signals on native input and change events', () => {
      const nameInput: HTMLInputElement = fixture.nativeElement.querySelector('#speaker-name');
      const emailInput: HTMLInputElement = fixture.nativeElement.querySelector('#speaker-email');
      const talkInput: HTMLInputElement = fixture.nativeElement.querySelector('#speaker-talk-title');
      const gdeInput: HTMLInputElement = fixture.nativeElement.querySelector('#speaker-gde');

      nameInput.value = 'John Smith';
      nameInput.dispatchEvent(new Event('input'));

      emailInput.value = 'john@example.com';
      emailInput.dispatchEvent(new Event('input'));

      talkInput.value = 'Building Scalable Monorepos';
      talkInput.dispatchEvent(new Event('input'));

      gdeInput.checked = true;
      gdeInput.dispatchEvent(new Event('change'));

      fixture.detectChanges();

      expect(component.name()).toBe('John Smith');
      expect(component.email()).toBe('john@example.com');
      expect(component.talkTitle()).toBe('Building Scalable Monorepos');
      expect(component.isGDE()).toBe(true);
      expect(component.isFormValid()).toBe(true);
    });
  });

  describe('Accessibility & Error Feedback (WAI-ARIA)', () => {
    it('should show aria-invalid and aria-describedby when a required field is blurred empty', () => {
      const nameInput: HTMLInputElement = fixture.nativeElement.querySelector('#speaker-name');
      expect(nameInput.getAttribute('aria-invalid')).toBe('false');
      expect(nameInput.getAttribute('aria-describedby')).toBeNull();

      nameInput.dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      expect(component.nameTouched()).toBe(true);
      expect(component.nameError()).toBe('Name is required.');
      expect(nameInput.getAttribute('aria-invalid')).toBe('true');
      expect(nameInput.getAttribute('aria-describedby')).toBe('name-error');

      const errorSpan = fixture.nativeElement.querySelector('#name-error');
      expect(errorSpan).toBeTruthy();
      expect(errorSpan.textContent).toContain('Name is required.');
      expect(errorSpan.getAttribute('role')).toBe('alert');
    });

    it('should show validation error for malformed email on blur', () => {
      component.email.set('not-an-email');
      component.onBlur('email');
      fixture.detectChanges();

      expect(component.emailError()).toBe('Please enter a valid email address.');
      const emailInput: HTMLInputElement = fixture.nativeElement.querySelector('#speaker-email');
      expect(emailInput.getAttribute('aria-invalid')).toBe('true');
      expect(emailInput.getAttribute('aria-describedby')).toBe('email-error');
    });
  });

  describe('Submission State Updates', () => {
    it('should update state signals and display success message on successful submission', () => {
      const validPayload: SpeakerDTO = {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        talkTitle: 'Mastering NestJS & Angular',
        isGDE: false,
      };

      const responseDto: SpeakerDTO = {
        id: 'cfp-999',
        ...validPayload,
      };

      mockCfpService.submitProposal.mockReturnValue(of(responseDto));

      component.name.set(validPayload.name);
      component.email.set(validPayload.email);
      component.talkTitle.set(validPayload.talkTitle);
      component.isGDE.set(validPayload.isGDE ?? false);
      fixture.detectChanges();

      component.onSubmit();
      fixture.detectChanges();

      expect(mockCfpService.submitProposal).toHaveBeenCalledWith(validPayload);
      expect(component.isSubmitting()).toBe(false);
      expect(component.isSubmitted()).toBe(true);
      expect(component.submitSuccess()).toBe('Talk proposal submitted successfully!');
      expect(component.submitError()).toBeNull();

      const successElem = fixture.nativeElement.querySelector('.status-success');
      expect(successElem).toBeTruthy();
      expect(successElem.textContent).toContain('Talk proposal submitted successfully!');
    });

    it('should update state signals and display error message when submission fails', () => {
      mockCfpService.submitProposal.mockReturnValue(
        throwError(() => ({
          error: { message: 'Submission failed: email already registered.' },
        }))
      );

      component.name.set('Bob Ross');
      component.email.set('bob@example.com');
      component.talkTitle.set('The Joy of Angular');
      fixture.detectChanges();

      component.onSubmit();
      fixture.detectChanges();

      expect(mockCfpService.submitProposal).toHaveBeenCalled();
      expect(component.isSubmitting()).toBe(false);
      expect(component.isSubmitted()).toBe(false);
      expect(component.submitError()).toBe(
        'Submission failed: email already registered.'
      );

      const errorElem = fixture.nativeElement.querySelector('.status-error');
      expect(errorElem).toBeTruthy();
      expect(errorElem.textContent).toContain(
        'Submission failed: email already registered.'
      );
    });

    it('should not call submitProposal if form is invalid', () => {
      component.onSubmit();
      expect(mockCfpService.submitProposal).not.toHaveBeenCalled();
      expect(component.nameTouched()).toBe(true);
      expect(component.emailTouched()).toBe(true);
      expect(component.talkTitleTouched()).toBe(true);
    });
  });

  describe('Dashboard Navigation Link', () => {
    it('should have a navigation link to the dashboard with accessible attributes', () => {
      const dashboardLink: HTMLAnchorElement = fixture.nativeElement.querySelector(
        '#view-dashboard-btn'
      );
      expect(dashboardLink).toBeTruthy();
      expect(dashboardLink.getAttribute('href')).toBe('/dashboard');
      expect(dashboardLink.getAttribute('aria-label')).toBe(
        'View submitted proposals dashboard'
      );
      expect(dashboardLink.textContent).toContain('View Dashboard');
    });
  });
});
