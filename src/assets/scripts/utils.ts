export function randInt(range: number): number
{
    return Math.floor(Math.random() * range)
}

export class EventObject<T = any> {
  private target: EventTarget;

  constructor() {
    this.target = new EventTarget();
  }
  subscribe(callback: (payload: T) => void) {
    const listener = (e: Event) => callback((e as CustomEvent<T>).detail);
    this.target.addEventListener("trigger", listener);
    return () => this.target.removeEventListener("trigger", listener);
  }

  emit(payload: T) {
    this.target.dispatchEvent(new CustomEvent("trigger", { detail: payload }));
  }
}