import {FormControl, FormGroup} from "@angular/forms";
import {CustomValidators} from "../validators/custom.validator";
import {MdpUtils} from "./mdp-utils";

const mdpUtils = new MdpUtils();
const form = new FormGroup({
    password1: new FormControl('Myriam24!')
})

describe('mdpUtilsTest', () => {
    it('verifMinusculeTest', () => {
        const result = mdpUtils.verifMinuscule(form)
        expect(result).toBe('green');
    });
    it('verifCapitaleTest', () => {
        const result = mdpUtils.verifCapitale(form)
        expect(result).toBe('green');
    });
    it('verifChiffreTest', () => {
        const result = mdpUtils.verifChiffre(form)
        expect(result).toBe('green');
    });
    it('verifCaractereSpecialTest', () => {
        const result = mdpUtils.verifCaractereSpecial(form)
        expect(result).toBe('green');
    });
    it('verifLongueurTest', () => {
        const result = mdpUtils.verifLongueur(form)
        expect(result).toBe('green');
    });
});
