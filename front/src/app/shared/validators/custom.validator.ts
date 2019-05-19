import {AbstractControl, FormControl, ValidatorFn} from '@angular/forms';

export class CustomValidators {

    /**
     * Validator pour s'assurer que le prix max est supérieur au prix min
     */
    static prixMaxValidator() {
        return (control: AbstractControl): { [key: string]: any } | null => {
            if (control.parent) {
                const prixMin = control.parent.get('prixMin').value;
                if (control.value && control.value >= prixMin) {
                    return null;
                } else {
                    return {'prixMax': true};
                }
            }
        };
    }

    /**
     * Validator pour s'assurer que la quantitée selectionnée n'est pas superieur a la quantitée du produit
     */
    static quantiteeValidator() {
        return (control: AbstractControl): { [key: string]: any } | null => {
            if (control.parent) {
                const quantite = control.parent.get('produit').value.quantite;
                if (control.value && control.value <= quantite) {
                    return null;
                } else {
                    return {'prixMax': true};
                }
            }
        };
    }

    /**
     * verifie que les deux mdp sont identiques
     * @param password1 le mot de passe a comparer
     */
    static passwordMatchValidator() {
        return (control: AbstractControl): { [key: string]: any } | null => {
            if (control.parent) {
                const password1 = control.parent.get('password1').value;
                if (control.value && control.value === password1) {
                    return null;
                } else {
                    return {'password2': true};
                }
            }
        };
    }

    /**
     * verifie que le produit entré fait partie de la liste de produits
     */
    static produitValidator() {
        return (control: AbstractControl): { [key: string]: any } | null => {
            if (typeof control.value !== 'string') {
                return null;
            } else {
                return {'produit': true};
            }
        };
    }

    /**
     * verifie que le produit entré fait partie de la liste de produits
     */
    static usernameValidator(liste: string[]) {
        return (control: AbstractControl): { [key: string]: any } | null => {
            let existe = false;
            if (liste) {
                liste.forEach(
                    u => {
                        if (u == control.value) {
                            existe = true;
                        }
                    }
                );
            }
            if (existe) {
                return {'username': true};
            } else {
                return null;
            }
        };
    }
}

