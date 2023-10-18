import { describe, expect, it, jest } from "bun:test";
import { Observable } from ".";

describe("Observable", () => {
  it("should notify on subscriber value change", async () => {
    const observable = new Observable<number>(0);
    const subscriber1 = jest.fn();

    observable.subscribe(subscriber1);

    observable.set(42);

    expect(subscriber1).toHaveBeenCalledTimes(1);
  });

  it("should unsubscribe correctly", async () => {
    const observable = new Observable<number>(0);
    const subscriber1 = jest.fn();

    const unsubscribe = observable.subscribe(subscriber1);

    observable.set(42);

    unsubscribe();
    observable.set(99);

    expect(subscriber1).toHaveBeenCalledTimes(1);

    await new Promise((resolve) => {
      setTimeout(() => {
        const subscriber2 = jest.fn();

        const unsubscribe2 = observable.subscribe(subscriber2);

        unsubscribe2();

        expect(subscriber2).not.toHaveBeenCalled();

        resolve(subscriber2);
      }, 0);
    });
  });

  it("should return correct initial value", () => {
    const observable = new Observable<string>("this is a test run");

    expect(observable.get()).toBe("this is a test run");
  });

  it("should return correct updated value", () => {
    const observable = new Observable<string>("this is a test run");

    observable.set("this is an updated test run!");

    expect(observable.get()).toBe("this is an updated test run!");
  });

  it("should work with an array of numbers", async () => {
    const observable = new Observable<number[]>([]);
    observable.set([1, 2, 3]);

    expect(observable.get()).toEqual([1, 2, 3]);

    await new Promise((resolve) => {
      setTimeout(() => {
        observable.set([4, 5]);

        expect(observable.get()).toEqual([4, 5]);

        resolve(observable);
      }, 100);
    });
  });
  it("should handle concurrent subscribers", () => {
    const observable = new Observable<number>(0);
    const subscriber1 = jest.fn();
    const subscriber2 = jest.fn();

    observable.subscribe(subscriber1);
    observable.subscribe(subscriber2);

    observable.set(42);

    expect(subscriber1).toHaveBeenCalledTimes(1);
    expect(subscriber2).toHaveBeenCalledTimes(1);
  });
  it("should handle errors", () => {
    const observable = new Observable<number>(0);
    const errorCallback = jest.fn();

    const unsubscribe = observable.subscribe(() => {
      throw new Error("Test error");
    });

    observable.subscribe(() => {
      errorCallback();
    });

    expect(() => observable.set(42)).toThrow("Test error");
    unsubscribe();
    observable.set(99);

    expect(errorCallback).toHaveBeenCalled();
  });
  it("should handle asynchronous operations", async () => {
    const observable = new Observable<number>(0);
    const subscriber1 = jest.fn();
    const subscriber2 = jest.fn();

    observable.subscribe(subscriber1);

    observable.set(42);

    await new Promise((resolve) => {
      setTimeout(() => {
        observable.subscribe(subscriber2);

        observable.set(99);

        expect(subscriber1).toHaveBeenCalledTimes(2);
        expect(subscriber2).toHaveBeenCalledTimes(1);

        resolve(observable);
      }, 100);
    });
  });
  it("should handle performance with a large number of subscribers", () => {
    const observable = new Observable<number>(0);
    const numSubscribers = 1000;

    const subscribers = Array.from({ length: numSubscribers }, (_, index) => {
      const subscriber = jest.fn();
      observable.subscribe(subscriber);
      return subscriber;
    });

    observable.set(42);

    subscribers.forEach((subscriber) => {
      expect(subscriber).toHaveBeenCalledTimes(1);
    });
  });
});
