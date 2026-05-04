import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { SessionService } from '../services/session.service';
import { IdleTimeoutService } from '../services/idle-timeout.service';

/**
 * Session warning dialog component
 * Displays a warning when session is about to expire
 */
@Component({
  selector: 'sm-session-warning-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sm-dialog-overlay" *ngIf="showDialog">
      <div class="sm-dialog-container">
        <div class="sm-dialog-header">
          <h2>Session Timeout Warning</h2>
        </div>
        <div class="sm-dialog-content">
          <p>Your session is about to expire due to inactivity.</p>
          <p class="sm-timer">
            Time remaining: <strong>{{ formatTime(timeRemaining) }}</strong>
          </p>
          <p>Do you want to continue your session?</p>
        </div>
        <div class="sm-dialog-actions">
          <button class="sm-btn sm-btn-primary" (click)="continueSession()">
            Continue Session
          </button>
          <button class="sm-btn sm-btn-secondary" (click)="signOut()">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .sm-dialog-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
      }

      .sm-dialog-container {
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        max-width: 500px;
        width: 90%;
        padding: 0;
        animation: slideIn 0.3s ease-out;
      }

      @keyframes slideIn {
        from {
          transform: translateY(-50px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      .sm-dialog-header {
        padding: 20px 24px;
        border-bottom: 1px solid #e5e7eb;
      }

      .sm-dialog-header h2 {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
        color: #111827;
      }

      .sm-dialog-content {
        padding: 24px;
      }

      .sm-dialog-content p {
        margin: 0 0 16px 0;
        color: #4b5563;
        line-height: 1.5;
      }

      .sm-timer {
        font-size: 18px;
        color: #dc2626;
        text-align: center;
        padding: 16px;
        background-color: #fef2f2;
        border-radius: 4px;
        margin: 16px 0 !important;
      }

      .sm-timer strong {
        font-size: 24px;
        font-weight: 700;
      }

      .sm-dialog-actions {
        padding: 16px 24px;
        border-top: 1px solid #e5e7eb;
        display: flex;
        gap: 12px;
        justify-content: flex-end;
      }

      .sm-btn {
        padding: 10px 20px;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
      }

      .sm-btn-primary {
        background-color: #2563eb;
        color: white;
      }

      .sm-btn-primary:hover {
        background-color: #1d4ed8;
      }

      .sm-btn-secondary {
        background-color: #f3f4f6;
        color: #374151;
      }

      .sm-btn-secondary:hover {
        background-color: #e5e7eb;
      }
    `,
  ],
})
export class SessionWarningDialogComponent implements OnInit, OnDestroy {
  showDialog = false;
  timeRemaining = 0;
  private destroy$ = new Subject<void>();

  constructor(
    private sessionService: SessionService,
    private idleTimeoutService: IdleTimeoutService
  ) {}

  ngOnInit(): void {
    // Subscribe to warning dialog state
    this.sessionService.warningDialog$
      .pipe(takeUntil(this.destroy$))
      .subscribe((show) => {
        this.showDialog = show;
      });

    // Subscribe to time remaining updates
    this.idleTimeoutService.warning$
      .pipe(takeUntil(this.destroy$))
      .subscribe((remaining) => {
        this.timeRemaining = remaining;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Continue the session
   */
  continueSession(): void {
    this.sessionService.extendSession();
    this.showDialog = false;
  }

  /**
   * Sign out
   */
  signOut(): void {
    this.sessionService.endSession('logout');
    this.showDialog = false;
  }

  /**
   * Format time in MM:SS format
   */
  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}

// Made with Bob
