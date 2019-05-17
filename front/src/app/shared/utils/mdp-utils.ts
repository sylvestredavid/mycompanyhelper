import {FormGroup} from '@angular/forms';

export class MdpUtils {
    /**
     * verifie si le mdp contient au moins 1 minuscule
     * @return string la couleur du text
     */
    verifMinuscule(form: FormGroup): string {
        if (form.value.password1 && form.value.password1.match(/[a-z]/g)) {
            return 'green';
        }
        return 'red';
    }

    /**
     * verifie si le mdp contient au moins 1 majuscule
     * @return string la couleur du text
     */
    verifCapitale(form: FormGroup): string {
        if (form.value.password1 && form.value.password1.match(/[A-Z]/g)) {
            return 'green';
        }
        return 'red';
    }

    /**
     * verifie si le mdp contient au moins 1 chiffre
     * @return string la couleur du text
     */
    verifChiffre(form: FormGroup): string {
        if (form.value.password1 && form.value.password1.match(/\d/g)) {
            return 'green';
        }
        return 'red';
    }

    /**
     * verifie si le mdp contient au moins 1 caractere special
     * @return string la couleur du text
     */
    verifCaractereSpecial(form: FormGroup): string {
        if (form.value.password1 && form.value.password1.match(/[\W]/g)) {
            return 'green';
        }
        return 'red';
    }


    /**
     * verifie si le mdp au une longueur d'au moins 8
     * @return string la couleur du text
     */
    verifLongueur(form: FormGroup): string {
        if (form.value.password1 && form.value.password1.length >= 8) {
            return 'green';
        }
        return 'red';
    }
}
