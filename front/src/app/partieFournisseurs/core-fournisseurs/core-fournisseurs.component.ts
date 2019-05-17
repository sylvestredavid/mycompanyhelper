import {Component, HostListener, OnInit, Inject} from '@angular/core';
import {UsersService} from '../../users/users.service';
import {MatDialog, MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {UserState} from '../../shared/stores/user.reducer';
import {Store} from '@ngrx/store';
import {DeleteUser} from '../../shared/stores/user.actions';
import {Router} from '@angular/router';
import {map} from 'rxjs/operators';
import {MessageListComponent} from '../../shared/chatbot/message-list/message-list.component';
import { LOCAL_STORAGE, WINDOW } from '@ng-toolkit/universal';

@Component({
    selector: 'app-core-fournisseurs',
    templateUrl: './core-fournisseurs.component.html',
    styleUrls: ['./core-fournisseurs.component.scss']
})
export class CoreFournisseursComponent implements OnInit {

    entreprise: string;
    screenWidth: number;

    constructor(@Inject(WINDOW) private window: Window, @Inject(LOCAL_STORAGE) private localStorage: any, private userService: UsersService, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer,
                private store: Store<UserState>, public dialog: MatDialog, private router: Router) {
        iconRegistry.addSvgIcon(
            'quit',
            sanitizer.bypassSecurityTrustResourceUrl('/assets/sortie.svg'));
        iconRegistry.addSvgIcon(
            'aide',
            sanitizer.bypassSecurityTrustResourceUrl('/assets/aide.svg'));
    }

    ngOnInit(): void {
        this.getEntreprise();
        this.getScreenSize();
    }

    /**
     * fonction de sortie
     */
    sortie() {
        sessionStorage.removeItem('token');
        this.localStorage.removeItem('token');
        this.store.dispatch(new DeleteUser());
        this.router.navigate(['']);
    }

    private getEntreprise() {
        this.store.select('user').pipe(
            map(user => {
                if (user) {
                    return user[0].entreprise;
                }
            })
        ).subscribe(
            entreprise => {
                    this.entreprise = entreprise;
            }
        );
    }

    @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
        this.screenWidth = this.window.innerWidth;
    }

    openChatBot() {
        this.dialog.open(MessageListComponent);
    }
}
