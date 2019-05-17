import {CustomValidators} from './custom.validator';
import {FormControl, FormGroup} from '@angular/forms';

describe('customValidator', () => {

    it('prixMaxValidator', () => {
        const genericForm = new FormGroup({
            prixMin: new FormControl(8),
            prixMax: new FormControl(12, CustomValidators.prixMaxValidator)
        })
        expect(genericForm.valid).toBeTruthy();
    });
});
