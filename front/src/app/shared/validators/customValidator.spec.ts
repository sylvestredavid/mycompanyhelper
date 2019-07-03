import {CustomValidators} from './custom.validator';
import {FormControl, FormGroup} from '@angular/forms';

describe('customValidator', () => {

    it('passwordMatchValidator', () => {
        const genericForm = new FormGroup({
            password1: new FormControl('Myriam24!'),
            password2: new FormControl('Myriam24!', CustomValidators.passwordMatchValidator)
        })
        expect(genericForm.valid).toBeTruthy();
    });
});
