import pb from '@/lib/pocketbaseClient';

class OfflineSyncManager {
  constructor() {
    this.queueKey = 'photoguide_offline_queue';
    this.isSyncing = false;
    this.listeners = new Set();
  }

  getQueue() {
    try {
      const data = localStorage.getItem(this.queueKey);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  saveQueue(queue) {
    localStorage.setItem(this.queueKey, JSON.stringify(queue));
    this.notifyListeners();
  }

  async addToQueue(photoData) {
    const queue = this.getQueue();
    queue.push({
      id: Date.now().toString(),
      timestamp: Date.now(),
      data: photoData,
      attempts: 0
    });
    this.saveQueue(queue);
    
    if (navigator.onLine) {
      this.syncQueue();
    }
  }

  async syncQueue() {
    if (this.isSyncing || !navigator.onLine) return;
    
    const queue = this.getQueue();
    if (queue.length === 0) return;

    this.isSyncing = true;
    this.notifyListeners();

    const newQueue = [...queue];
    
    for (let i = 0; i < newQueue.length; i++) {
      const item = newQueue[i];
      try {
        // Convert base64 back to blob for PocketBase
        const res = await fetch(item.data.base64Data);
        const blob = await res.blob();
        
        const formData = new FormData();
        formData.append('propertyId', item.data.propertyId);
        formData.append('environmentName', item.data.environmentName);
        formData.append('photoIndex', item.data.photoIndex);
        formData.append('completed', item.data.completed);
        formData.append('image', blob, `${item.data.environmentName}_${item.data.photoIndex}.jpg`);

        await pb.collection('photos').create(formData, { $autoCancel: false });
        
        // Remove from queue on success
        newQueue.splice(i, 1);
        i--; // Adjust index after removal
      } catch (error) {
        console.error('Sync failed for item:', item.id, error);
        item.attempts += 1;
      }
    }

    this.saveQueue(newQueue);
    this.isSyncing = false;
    this.notifyListeners();
  }

  getQueueStatus() {
    const queue = this.getQueue();
    return {
      pendingCount: queue.length,
      isSyncing: this.isSyncing,
      isOnline: navigator.onLine
    };
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners() {
    const status = this.getQueueStatus();
    this.listeners.forEach(cb => cb(status));
  }
}

export const offlineSyncManager = new OfflineSyncManager();

// Listen for online events to trigger sync
window.addEventListener('online', () => {
  offlineSyncManager.syncQueue();
});