export class IllegalArgumentException extends Error {
  constructor(message?: string) {
    super(message || 'Illegal argument exception');
    this.name = 'IllegalArgumentException';
  }
}
