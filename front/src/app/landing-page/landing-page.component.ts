import {Component, HostListener, OnInit, Inject} from '@angular/core';
import {WINDOW} from '@ng-toolkit/universal';
import {Title} from '@angular/platform-browser';

@Component({
    selector: 'app-landing-page',
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
    screenWidth: number;

    constructor(@Inject(WINDOW) private window: Window, private titleService: Title) {
    }

    ngOnInit() {
        this.titleService.setTitle('mycompanyhelper le meilleur allié pour votre entreprise');
        this.getScreenSize();
    }

    @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
        this.screenWidth = this.window.innerWidth;
    }

}
