import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { CfpDashboardComponent } from './cfp-dashboard.component';
import { CfpService } from './cfp.service';
import { SpeakerDTO } from '@cfp-platform/shared-types';

describe('CfpDashboardComponent', () => {
  let component: CfpDashboardComponent;
  let fixture: ComponentFixture<CfpDashboardComponent>;
  let mockCfpService: {
    getProposals: ReturnType<typeof vi.fn>;
  };

  const mockProposalsList: SpeakerDTO[] = [
    {
      id: 'prop-1',
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      talkTitle: 'First Computer Algorithms',
      isGDE: true,
    },
    {
      id: 'prop-2',
      name: 'Alan Turing',
      email: 'alan@example.com',
      talkTitle: 'Universal Computation and AI',
      isGDE: false,
    },
  ];

  beforeEach(async () => {
    mockCfpService = {
      getProposals: vi.fn().mockReturnValue(of(mockProposalsList)),
    };

    await TestBed.configureTestingModule({
      imports: [CfpDashboardComponent],
      providers: [
        provideRouter([]),
        {
          provide: CfpService,
          useValue: mockCfpService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CfpDashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create the dashboard component', () => {
    expect(component).toBeTruthy();
  });

  describe('Signal State Initialization and Data Loading', () => {
    it('should initialize signals and fetch proposals on ngOnInit', () => {
      fixture.detectChanges(); // triggers ngOnInit

      expect(mockCfpService.getProposals).toHaveBeenCalledTimes(1);
      expect(component.isLoading()).toBe(false);
      expect(component.errorMessage()).toBeNull();
      expect(component.proposals()).toEqual(mockProposalsList);
    });

    it('should render table rows with proposal details and GDE badge', () => {
      fixture.detectChanges();

      const rows: HTMLTableRowElement[] =
        fixture.nativeElement.querySelectorAll('.proposal-row');
      expect(rows.length).toBe(2);

      // Check first row (Ada Lovelace, GDE)
      const firstRow = rows[0];
      expect(firstRow.querySelector('.speaker-name')?.textContent).toContain(
        'Ada Lovelace'
      );
      expect(firstRow.querySelector('.speaker-email')?.textContent).toContain(
        'ada@example.com'
      );
      expect(firstRow.querySelector('.talk-title')?.textContent).toContain(
        'First Computer Algorithms'
      );
      const gdeBadge = firstRow.querySelector('.badge-gde');
      expect(gdeBadge).toBeTruthy();
      expect(gdeBadge?.textContent).toContain('GDE');

      // Check second row (Alan Turing, not GDE)
      const secondRow = rows[1];
      expect(secondRow.querySelector('.speaker-name')?.textContent).toContain(
        'Alan Turing'
      );
      expect(secondRow.querySelector('.speaker-email')?.textContent).toContain(
        'alan@example.com'
      );
      expect(secondRow.querySelector('.talk-title')?.textContent).toContain(
        'Universal Computation and AI'
      );
      expect(secondRow.querySelector('.badge-gde')).toBeNull();
      expect(secondRow.querySelector('.badge-regular')).toBeTruthy();
    });
  });

  describe('Empty State Handling', () => {
    it('should display empty state when proposals list is empty', () => {
      mockCfpService.getProposals.mockReturnValue(of([]));
      fixture.detectChanges();

      expect(component.isLoading()).toBe(false);
      expect(component.proposals().length).toBe(0);

      const emptyRegion = fixture.nativeElement.querySelector('.empty-state');
      expect(emptyRegion).toBeTruthy();
      expect(emptyRegion.textContent).toContain(
        'No talk proposals have been submitted yet.'
      );

      const table = fixture.nativeElement.querySelector('.proposals-table');
      expect(table).toBeNull();
    });
  });

  describe('Error State Handling and Retry', () => {
    it('should set errorMessage and render accessible alert when fetch fails', () => {
      mockCfpService.getProposals.mockReturnValue(
        throwError(() => ({
          error: { message: 'Server unavailable. Please try again later.' },
        }))
      );

      fixture.detectChanges();

      expect(component.isLoading()).toBe(false);
      expect(component.errorMessage()).toBe(
        'Server unavailable. Please try again later.'
      );

      const alertEl = fixture.nativeElement.querySelector('.status-error');
      expect(alertEl).toBeTruthy();
      expect(alertEl.getAttribute('role')).toBe('alert');
      expect(alertEl.textContent).toContain(
        'Server unavailable. Please try again later.'
      );
    });

    it('should allow user to retry loading proposals on error', () => {
      mockCfpService.getProposals.mockReturnValueOnce(
        throwError(() => ({
          error: { message: 'Network error' },
        }))
      );

      fixture.detectChanges();
      expect(component.errorMessage()).toBe('Network error');

      // Now mock successful response for retry
      mockCfpService.getProposals.mockReturnValueOnce(of(mockProposalsList));
      const retryBtn: HTMLButtonElement =
        fixture.nativeElement.querySelector('.retry-btn');
      expect(retryBtn).toBeTruthy();

      retryBtn.click();
      fixture.detectChanges();

      expect(mockCfpService.getProposals).toHaveBeenCalledTimes(2);
      expect(component.isLoading()).toBe(false);
      expect(component.errorMessage()).toBeNull();
      expect(component.proposals().length).toBe(2);
    });
  });
});
