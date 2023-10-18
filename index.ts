export class Observable<T> {
  value: T;
  subscribers: ((value: T) => void)[] = [];

  constructor(initialValue: T) {
    this.value = initialValue;
  }

  subscribe(callBack: (value: T) => void): () => void {
    this.subscribers.push(callBack);

    return () => {
      const index = this.subscribers.indexOf(callBack);
      if (index !== -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  set(newValue: T): void {
    this.value = newValue;
    this.countSubs();
  }

  get(): T {
    return this.value;
  }

  countSubs(): void {
    for (let subscriber of this.subscribers) {
      subscriber(this.value);
    }
  }
}
