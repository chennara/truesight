// @flow

// Defines an interval of numbers in [begin, end].
export class Interval {
  begin: number;
  end: number;

  constructor(begin: number, end: number) {
    this.begin = begin;
    this.end = end;
  }

  liesIn(value: number): boolean {
    return value >= this.begin && value <= this.end;
  }

  toString(): string {
    return `[${this.begin}, ${this.end}]`;
  }
}
