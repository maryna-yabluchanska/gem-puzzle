export class SettingsHolders {

    constructor(label, onChange) {
        this.settingsHolder = document.createElement('div');
        this.settingsHolder.className = 'settings-holder';

        this.addLabel(label);
        this.createChangeSizeButton(2, onChange);
        this.createChangeSizeButton(3, onChange);
        this.createChangeSizeButton(4, onChange);
        this.createChangeSizeButton(5, onChange);
        this.createChangeSizeButton(6, onChange);
        this.createChangeSizeButton(7, onChange);
        this.createChangeSizeButton(8, onChange);
    }

    addLabel(textValue) {
        const label = document.createElement('label');
        label.textContent = textValue;
        this.settingsHolder.appendChild(label);
    }

    createChangeSizeButton(gameSize, onChange) {
        const button = document.createElement('input');
        button.type = 'button';
        button.value = `${gameSize}x${gameSize}`;
        button.accesskey = gameSize;
        button.addEventListener('click', (event) => {
            console.log(event)
            let newSize = event.target.accesskey;
            onChange(newSize);
        });
        this.settingsHolder.appendChild(button);
    }

    get holder() {
        return this.settingsHolder;
    }
}
