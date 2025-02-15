/**
 * Component abstraction.
 * 
 * @param {HTMLElement} container 
 */
class Component {
    constructor(container) {
        if (!(container instanceof HTMLElement)) throw new TypeError(`${container} is not an HTMLElement`);

        this.container = container;
    }

    show() {
        this.container.classList.remove('hide');
        this.container.classList.add('show');
    }

    hide() {
        this.container.classList.remove('show');
        this.container.classList.add('hide');
    }

    clearInputs() {
        let inputs = document.getElementsByTagName("input");

        for (let i = 0; i < inputs.length; i++) {
            inputs[i].value = "";
        }
    }
}