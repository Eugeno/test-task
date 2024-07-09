import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import 'zone.js';
import { Item, UserService } from './user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgFor],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button type="button" (click)="add()">add</button>
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
      <input #input type="text" (input)="search(input.value)">
      @if (result) {
        {{result.name}} — {{result.amount}}
      }
    </p>
  `,
})
export class App implements OnInit {
  userService = inject(UserService);

  items: Item[] = [];
  total!: number;
  result?: Item;

  ngOnInit() {
    this.getUsers();
    this.total = this.items.reduce((acc, item) => acc + item.amount, 0);
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
        console.log(acc);
        acc.push()
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
}

bootstrapApplication(App)
  .catch((err) => console.error(err));
