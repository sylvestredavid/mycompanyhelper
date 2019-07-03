import {Directive, ElementRef, HostListener, Input, Renderer2} from '@angular/core';
import {Store} from '@ngrx/store';
import {UserState} from '../stores/user.reducer';

/**
 * directive qui transforme un input en champ texte modifiable en cliquant dessus
 */
@Directive({
    selector: '[inputReadOnly]'
})
export class InputReadOnlyDirective {

    private elt: HTMLElement;

    @Input() inputReadOnly: boolean;

    constructor(private elementRef: ElementRef, private renderer: Renderer2) {
        this.elt = this.elementRef.nativeElement;
        this.renderer.addClass(this.elt, 'readOnly');
        this.elt.setAttribute('readonly', 'true');
    }


    /**
     * quand on click, l'input apparait et est saisissable, les autres input deviennent ou restent caché
     * @param event click
     */
    @HostListener('click', ['$event']) onMouseEnter(event: Event) {
        if (this.inputReadOnly) {
            // on recupere tout les autres inputs de la page et les caches
            const inputs = document.getElementsByTagName('input');
            for (let i = 0; i < inputs.length; i++) {
                if (inputs.item(i) !== this.elt) {
                    inputs.item(i).classList.add('readOnly');
                    inputs.item(i).style.backgroundColor = null;
                    inputs.item(i).setAttribute('readonly', 'true');
                }
            }
            // idem pour les textarea
            const textarea = document.getElementsByTagName('textarea');
            for (let i = 0; i < textarea.length; i++) {
                if (textarea.item(i) !== this.elt) {
                    textarea.item(i).classList.add('readOnly');
                    textarea.item(i).style.backgroundColor = null;
                    textarea.item(i).setAttribute('readonly', 'true');
                }
            }
            // l'input cliqué apparait et est saisissable
            this.elt.removeAttribute('readonly');
            this.renderer.removeClass(this.elt, 'readOnly');
            this.renderer.setStyle(this.elt, 'background-color', 'white');
        }
    }

    /**
     * quand on clique sur entree, l'input redevient caché et inssaisissable
     * @param event touche entree
     */
    @HostListener('document:keydown.enter', ['$event']) onKeydownHandler(event: KeyboardEvent) {
        if (this.inputReadOnly) {
            this.renderer.addClass(this.elt, 'readOnly');
            this.renderer.removeStyle(this.elt, 'background-color');
            this.elt.setAttribute('readonly', 'true');
        }
    }
}
