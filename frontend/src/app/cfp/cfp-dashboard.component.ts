import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CfpService } from './cfp.service';
import { SpeakerDTO } from '@cfp-platform/shared-types';

@Component({
  selector: 'app-cfp-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cfp-dashboard.component.html',
  styleUrl: './cfp-dashboard.component.css',
})
export class CfpDashboardComponent implements OnInit {
  private readonly cfpService = inject(CfpService);

  readonly proposals = signal<SpeakerDTO[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadProposals();
  }

  loadProposals(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.cfpService.getProposals().subscribe({
      next: (data) => {
        this.proposals.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          err?.error?.message || 'Failed to load proposals. Please try again.'
        );
      },
    });
  }
}
