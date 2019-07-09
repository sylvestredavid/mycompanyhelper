import {Component, HostListener, OnInit} from '@angular/core';

import {Title} from '@angular/platform-browser';

@Component({
    selector: 'app-landing-page',
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
    screenWidth: number;

    constructor(private titleService: Title) {
    }

    ngOnInit() {
        this.getScreenSize();
    }

    @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
        this.screenWidth = window.innerWidth;
    }

}
