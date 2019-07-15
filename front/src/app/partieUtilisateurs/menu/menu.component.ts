import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {UserState} from "../../shared/stores/user.reducer";

@Component({
    selector: 'app-ajout-genre',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnDestroy {
    private role: string;

    constructor(private store: Store<UserState>) {
    }

    ngOnInit() {
        this.store.select('user').subscribe(
            user => {
                if (user) {
                    this.role = user[0].authorities;
                }
            }
        );

    }

    ngOnDestroy(): void {
    }

}
