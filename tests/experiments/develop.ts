/// <reference path="../blend/blend.d.ts" />


Blend.Runtime.ready(function() {

    Blend.DEBUG = true;

    var bodyEl = Blend.getElement(document.body);
    var fa_icon = 'face';
    var buttonTypes: Array<string> = ['fab', 'fab-mini', 'flat', 'raised'];
    var iconAligns: Array<string> = ['left', 'right'];
    var buttons: Array<Blend.material.Material> = [];

    buttonTypes.forEach(function(buttonType: string) {

        var wrapper = Blend.createElement({
            cls: ['t-wrapper'],
            style: {
                border: '1px solid gray',
                margin: 5,
                padding: 5,
            },
            children: []
        });

        buttons.push(new Blend.button.Button({
            text: buttonType.ucfirst(),
            buttonType: buttonType,
        }));
        wrapper.append(buttons[buttons.length - 1].getElement());

        buttons.push(new Blend.button.Button({
            icon: fa_icon,
            buttonType: buttonType
        }));
        wrapper.append(buttons[buttons.length - 1].getElement());

        iconAligns.forEach(function(iconAlign: string) {

            var button = new Blend.button.Button(<ButtonInterface>{
                iconAlign: iconAlign,
                text: buttonType.ucfirst(),
                buttonType: buttonType,
                icon: fa_icon,
            });
            buttons.push(button);

            wrapper.append(button.getElement());

        });

        bodyEl.append(wrapper);
    });

    buttons.forEach(function(m: Blend.material.Material) {
        m.doInitialize();
    });

}).kickStart();