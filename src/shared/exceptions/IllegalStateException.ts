export class IllegalStateException extends Error {
  constructor(message?: string) {
    super(message || 'Illegal state exception');
    this.name = 'IllegalStateException';
  }
}
