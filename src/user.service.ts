import { Injectable } from "@angular/core";
import { map, Observable, timer } from "rxjs";

export interface Item {
  name: string;
  amount: number;
  emoji?: string;
}

const USERS: Item[] = [
  {
    name: 'John',
    amount: 31,
  },
  {
    name: 'Dave',
    amount: 14,
  },
  {
    name: 'Alex',
    amount: 27,
  },
]

@Injectable()
export class UserService {
  getUsers(): Observable<Item[]> {
    return timer(999).pipe(map(() => [...USERS]));
  }

  search(name: string): Observable<Item | null> {
    return timer(this.getRandomInt(111, 999)).pipe(map(() => USERS.find((user) => user.name.includes(name)) || null));
  }

  private getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (min - max + 1)) + min;
  }
}
