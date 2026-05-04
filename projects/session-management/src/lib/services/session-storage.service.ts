import { Injectable } from '@angular/core';
import { SessionConfig } from '../models/session-config.model';
import { SessionState, SessionStorageKey } from '../models/session-state.model';

/**
 * Service for managing session data in browser storage
 */
@Injectable({
  providedIn: 'root',
})
export class SessionStorageService {
  private storageType: 'localStorage' | 'sessionStorage' = 'localStorage';

  constructor() {}

  /**
   * Initialize storage type based on configuration
   */
  setStorageType(type: 'localStorage' | 'sessionStorage'): void {
    this.storageType = type;
  }

  /**
   * Get storage instance
   */
  private getStorage(): Storage {
    return this.storageType === 'localStorage'
      ? localStorage
      : sessionStorage;
  }

  /**
   * Set item in storage
   */
  setItem(key: string, value: any): void {
    try {
      const storage = this.getStorage();
      storage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error setting item in storage:', error);
    }
  }

  /**
   * Get item from storage
   */
  getItem<T>(key: string): T | null {
    try {
      const storage = this.getStorage();
      const item = storage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error getting item from storage:', error);
      return null;
    }
  }

  /**
   * Remove item from storage
   */
  removeItem(key: string): void {
    try {
      const storage = this.getStorage();
      storage.removeItem(key);
    } catch (error) {
      console.error('Error removing item from storage:', error);
    }
  }

  /**
   * Clear all session-related items from storage
   */
  clearSessionData(): void {
    try {
      const storage = this.getStorage();
      Object.values(SessionStorageKey).forEach((key) => {
        storage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing session data:', error);
    }
  }

  /**
   * Save session state
   */
  saveSessionState(state: SessionState): void {
    this.setItem(SessionStorageKey.SESSION_STATE, state);
  }

  /**
   * Get session state
   */
  getSessionState(): SessionState | null {
    return this.getItem<SessionState>(SessionStorageKey.SESSION_STATE);
  }

  /**
   * Save session configuration
   */
  saveSessionConfig(config: SessionConfig): void {
    this.setItem(SessionStorageKey.SESSION_CONFIG, config);
  }

  /**
   * Get session configuration
   */
  getSessionConfig(): SessionConfig | null {
    return this.getItem<SessionConfig>(SessionStorageKey.SESSION_CONFIG);
  }

  /**
   * Update last activity time
   */
  updateLastActivity(): void {
    this.setItem(SessionStorageKey.LAST_ACTIVITY, Date.now());
  }

  /**
   * Get last activity time
   */
  getLastActivity(): number | null {
    return this.getItem<number>(SessionStorageKey.LAST_ACTIVITY);
  }

  /**
   * Increment active tabs count
   */
  incrementActiveTabs(): number {
    const currentCount = this.getItem<number>(SessionStorageKey.ACTIVE_TABS) || 0;
    const newCount = currentCount + 1;
    this.setItem(SessionStorageKey.ACTIVE_TABS, newCount);
    return newCount;
  }

  /**
   * Decrement active tabs count
   */
  decrementActiveTabs(): number {
    const currentCount = this.getItem<number>(SessionStorageKey.ACTIVE_TABS) || 0;
    const newCount = Math.max(0, currentCount - 1);
    this.setItem(SessionStorageKey.ACTIVE_TABS, newCount);
    return newCount;
  }

  /**
   * Get active tabs count
   */
  getActiveTabs(): number {
    return this.getItem<number>(SessionStorageKey.ACTIVE_TABS) || 0;
  }

  /**
   * Check if storage is available
   */
  isStorageAvailable(): boolean {
    try {
      const storage = this.getStorage();
      const testKey = '__storage_test__';
      storage.setItem(testKey, 'test');
      storage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Made with Bob
