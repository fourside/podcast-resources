export class ClientError extends Error {
  constructor(err: string) {
    super(err);
    this.name = new.target.name;
    Object.setPrototypeOf(this, ClientError.prototype);
  }
}
