import { NgFor, NgIf } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { Subject, switchMap, tap } from 'rxjs';
import 'zone.js';
import { Item, UserService } from './user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgFor, NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button *ngIf="items.length" type="button" (click)="add()">add</button>
    <table>
      <tr *ngFor="let item of items">
        <td>{{item.name}}</td>
        <td>{{item.amount}}</td>
        <td>{{item.emoji}}</td>
      </tr>
    </table>
    <div>
      <b>total:</b>
      {{total}}
    </div>

    <hr>

    <p>
      <input #input type="text" placeholder="name" (input)="search(input.value)">
      @if (result) {
        {{result.name}} — {{result.amount}}
      }
    </p>

    <hr>

    <button type="button" (click)="load()">Load</button>
    <span *ngIf="loading">loading...</span>
  `,
})
export class App implements OnInit, AfterViewInit {
  userService = inject(UserService);

  items: Item[] = [];
  total!: number;
  result?: Item;

  loading = false;

  private subj = new Subject<void>();

  ngOnInit() {
    this.getUsers();
    this.total = this.items.reduce((acc, item) => acc + item.amount, 0);
  }

  ngAfterViewInit() {
    this.subj
      .pipe(tap(() => this.loading = true))
      .pipe(switchMap(() => this.userService.getData()))
      .subscribe({
        next: () => { this.loading = false },
        error: () => { this.loading = false },
      })
  }

  add() {
    this.items.push({
      name: 'Mike',
      amount: 99,
      emoji: '✨',
    });
  }

  search(name: string) {
    this.userService.search(name)
      .subscribe((user) => {
        if (user) {
          this.result = user;
        }
      })
  }

  getUsers() {
    this.userService.getUsers().subscribe((users) => {
      this.items = users.reduce((acc: Item[], item) => {
        return [
          ...acc,
          {
            ...item,
            emoji: item.amount < 20 ? '🙁' : item.amount < 30 ? '😐' : '🙂',
          }
        ];
      }, []);
    });
  }

  load() {
    this.subj.next();
  }
}

bootstrapApplication(App)
  .catch((err) => console.error(err));
