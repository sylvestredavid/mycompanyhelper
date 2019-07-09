import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ClientsService} from '../clients.service';
import {ClientModel} from '../../../models/client.model';
import {MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
    selector: 'app-client-detail',
    templateUrl: './client-detail.component.html',
    styleUrls: ['./client-detail.component.scss']
})
export class ClientDetailComponent implements OnInit, OnDestroy {

    client: ClientModel;

    constructor(private router: ActivatedRoute, private clientService: ClientsService,
                iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
        iconRegistry.addSvgIcon(
            'email',
            sanitizer.bypassSecurityTrustResourceUrl('/assets/mail.svg'));
        iconRegistry.addSvgIcon(
            'phone',
            sanitizer.bypassSecurityTrustResourceUrl('/assets/phone.svg'));
    }

    ngOnInit() {
        this.clientService.getClient(this.router.snapshot.params.id).subscribe(
            client => {
                this.client = client;
            }
        );
    }

    ngOnDestroy(): void {
    }

}
