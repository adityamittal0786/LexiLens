export interface SyncEvent<T = any> {
  type: 'PRESENCE_CHANGE' | 'INIT_SYNC' | 'CHECKLIST_TOGGLED' | 'VERSION_CREATED' | 'DOCUMENT_EDITED';
  payload?: T;
  clientId?: string;
  senderId?: string;
  activeCount?: number;
  state?: {
    checklistUpdates: Record<string, boolean>;
    documentVersions: Array<{ documentId: string; version: any }>;
  };
  timestamp?: string;
}

export type ConnectionStatus = 'connected' | 'connecting' | 'offline';

type EventListener = (event: SyncEvent) => void;

class RealtimeSyncManager {
  private eventSource: EventSource | null = null;
  private listeners: Set<EventListener> = new Set();
  private statusListeners: Set<(status: ConnectionStatus, activeCount: number) => void> = new Set();
  public clientId: string = `client-${Math.random().toString(36).substring(2, 9)}`;
  public status: ConnectionStatus = 'offline';
  public activeCollaborators: number = 1;
  private reconnectTimer: any = null;

  constructor() {
    this.connect();
  }

  public connect() {
    if (typeof window === 'undefined') return;

    if (this.eventSource) {
      try {
        this.eventSource.close();
      } catch {}
    }

    this.setStatus('connecting');

    try {
      this.eventSource = new EventSource('/api/sync/events');

      this.eventSource.onopen = () => {
        this.setStatus('connected');
      };

      this.eventSource.onmessage = (event) => {
        try {
          const data: SyncEvent = JSON.parse(event.data);
          
          if (data.type === 'INIT_SYNC') {
            if (data.clientId) this.clientId = data.clientId;
            if (typeof data.activeCount === 'number') {
              this.activeCollaborators = data.activeCount;
            }
          } else if (data.type === 'PRESENCE_CHANGE') {
            if (typeof data.activeCount === 'number') {
              this.activeCollaborators = data.activeCount;
            }
          }

          this.notifyStatusListeners();
          this.listeners.forEach((listener) => {
            try {
              listener(data);
            } catch (err) {
              console.error('Error in sync event listener:', err);
            }
          });
        } catch (e) {
          // Heartbeat or ping comment
        }
      };

      this.eventSource.onerror = () => {
        this.setStatus('offline');
        if (this.eventSource) {
          this.eventSource.close();
          this.eventSource = null;
        }

        // Retry connection after 5 seconds
        if (!this.reconnectTimer) {
          this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = null;
            this.connect();
          }, 5000);
        }
      };
    } catch {
      this.setStatus('offline');
    }
  }

  private setStatus(status: ConnectionStatus) {
    this.status = status;
    this.notifyStatusListeners();
  }

  private notifyStatusListeners() {
    this.statusListeners.forEach((fn) => fn(this.status, this.activeCollaborators));
  }

  public subscribe(listener: EventListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public onStatusChange(callback: (status: ConnectionStatus, activeCount: number) => void): () => void {
    this.statusListeners.add(callback);
    callback(this.status, this.activeCollaborators);
    return () => {
      this.statusListeners.delete(callback);
    };
  }

  public async broadcast(type: SyncEvent['type'], payload: any): Promise<boolean> {
    try {
      const res = await fetch('/api/sync/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          payload,
          senderId: this.clientId,
        }),
      });
      return res.ok;
    } catch (err) {
      console.warn('Sync broadcast failed:', err);
      return false;
    }
  }
}

export const realtimeSync = new RealtimeSyncManager();
