export class DbTable<T> {
  protected table: T

  constructor(table: T) {
    this.table = table
  }
}