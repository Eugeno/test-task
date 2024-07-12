import { Injectable } from '@angular/core';
import { map, Observable, switchMap, throwError, timer } from 'rxjs';
import { Item } from './user.type';
import { USERS } from './user.data';

@Injectable()
export class UserService {
  getUsers(): Observable<Item[]> {
    return timer(999).pipe(map(() => [...USERS]));
  }

  search(name: string): Observable<Item | null> {
    return timer(this.getRandomInt(111, 999))
      .pipe(map(() => USERS.find((user) => user.name.toLowerCase().includes(name.toLowerCase())) || null));
  }

  getData(): Observable<unknown> {
    return timer(2222).pipe(switchMap(() => throwError(() => 'error')));
  }

  private getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (min - max + 1)) + min;
  }
}
