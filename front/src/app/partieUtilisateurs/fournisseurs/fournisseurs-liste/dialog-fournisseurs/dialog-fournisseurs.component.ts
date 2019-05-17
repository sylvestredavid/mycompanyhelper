import {Component, Inject, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {GenreModel} from '../../../../models/genre.model';


export interface DialogData {
  listeGenres: GenreModel[];
  cat: string[];
  index: number;
}

@Component({
  selector: 'app-dialog-fournisseurs',
  templateUrl: './dialog-fournisseurs.component.html',
  styleUrls: ['./dialog-fournisseurs.component.scss']
})
export class DialogFournisseursComponent implements OnInit {

  form: FormGroup;

  constructor(
      public dialogRef: MatDialogRef<DialogFournisseursComponent>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData, private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      categories: this.fb.array([])
    });
    this.addProduits();
  }

  /**
   * crée les checkbox suivant la liste de genres
   */
  addProduits() {
    const categories = this.form.get('categories') as FormArray;
    this.data.listeGenres.forEach(genre => {
      let cocher = false;
      this.data.cat.forEach(cat => {
        if (genre.designation === cat) {
          categories.push(new FormControl(true));
          cocher = true;
        }
      });
      if (cocher === false) {
        categories.push(new FormControl(''));
      }
    });
  }

  getCategories() {
    return this.form.get('categories') as FormArray;
  }

  /**
   * si la checkbox est selectionnée, on recupere le genre correspondant dans la liste
   */
  checkboxToProduits() {
    let produits: GenreModel[] = [];
    for (let i = 0; i < this.form.value.categories.length; i++) {
      if (this.form.value.categories[i] === true) {
        produits.push(this.data.listeGenres[i]);
      }
    }
    this.data.cat = [];
    produits.forEach(prod => this.data.cat.push(prod.designation));

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
