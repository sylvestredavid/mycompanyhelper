import { Component, OnInit } from '@angular/core';
import {Store} from "@ngrx/store";
import {UserState} from "../stores/user.reducer";
import {FormBuilder, FormGroup, Validator, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {EmailModel} from "../../models/email.model";
import {MatSnackBar} from "@angular/material";
import {UsersService} from "../../users/users.service";

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit {

  email: string;
  contactForm: FormGroup;

  constructor(private store: Store<UserState>, private fb: FormBuilder, private http: HttpClient,
              private snackBar: MatSnackBar, private userService: UsersService) { }

  ngOnInit() {
    this.store.select('user').subscribe(
        user => this.email = user[0].username
    );
    this.contactForm = this.fb.group({
      sujet: ['', Validators.required],
      corps: ['', Validators.required]
    })
  }

  onSubmit(){
    const value = this.contactForm.value;

    const mail: EmailModel = {
      from: this.email,
      to: 'support@mycompanyhelper.com',
      titre: value.sujet,
      corps: value.corps
    }
    this.userService.mailSupport(mail).subscribe(
        () => this.snackBar.open('votre demande nous a bien été transmise, nous vous répondrons dans les plus bref delais.', 'ok', {duration: 1500})
    )
  }

}
