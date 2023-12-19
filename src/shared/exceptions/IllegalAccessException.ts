export class IllegalAccessException extends Error {
  constructor(message?: string) {
    super(message || 'Illegal access exception');
    this.name = 'IllegalAccessException';
  }
}
