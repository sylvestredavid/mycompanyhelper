import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {EmailModel} from "../../../models/email.model";
import {MailingService} from "../mailing.service";
import {MatSnackBar} from "@angular/material";
import {EntrepriseService} from "../../entreprise/entreprise.service";

@Component({
  selector: 'app-mailing',
  templateUrl: './mailing.component.html',
  styleUrls: ['./mailing.component.scss']
})
export class MailingComponent implements OnInit {

  @Input()
  selection: any[];
  mailForm: FormGroup;
  email: string;
  constructor(private fb: FormBuilder, private mailingService: MailingService, private snackBar: MatSnackBar, private entrepriseService: EntrepriseService) { }

  ngOnInit() {
    this.entrepriseService.entreprise$.subscribe(
        e => this.email = e.email
    )
    this.mailForm = this.fb.group({
      titre: ['', Validators.required],
      corps: ['', Validators.required]
    })
  }

  onSubmit() {
    this.selection.forEach(
        s => {
          const mail: EmailModel = {
            to: s.email,
            from: this.email,
            titre: this.mailForm.value.titre,
            corps: this.mailForm.value.corps
          };
          this.mailingService.sendMail(mail).subscribe();
        }
    )
    this.snackBar.open('Les emails ont bien été envoyés.', 'ok', {duration: 1500});
  }
}
