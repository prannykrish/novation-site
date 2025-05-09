// Simple event system for message notifications

type EventCallback = (...args: any[]) => void;

class EventEmitter {
  private events: Record<string, EventCallback[]> = {};

  // Subscribe to an event
  on(event: string, callback: EventCallback): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  // Unsubscribe from an event
  off(event: string, callback: EventCallback): void {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(cb => cb !== callback);
  }

  // Emit an event
  emit(event: string, ...args: any[]): void {
    console.log(`[EventEmitter] Emitting event: ${event}`, args);
    if (!this.events[event]) return;
    this.events[event].forEach(callback => {
      try {
        callback(...args);
      } catch (error) {
        console.error(`[EventEmitter] Error in event handler for ${event}:`, error);
      }
    });
  }
}

// Create a singleton instance
export const messageEvents = new EventEmitter();

// Define events
export const MESSAGE_EVENTS = {
  MESSAGE_READ: 'MESSAGE_READ', // When a message is marked as read
  NEW_MESSAGE: 'NEW_MESSAGE',  // When a new message is received
  UNREAD_COUNT_CHANGED: 'UNREAD_COUNT_CHANGED', // When the unread count changes
}; 