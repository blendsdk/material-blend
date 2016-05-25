/// <reference path="../blend/blend.d.ts" />


Blend.Runtime.ready(function() {

    Blend.DEBUG = true;

    var bodyEl = Blend.getElement(document.body);
    var fa_icon = 'face';
    var buttonTypes: Array<string> = ['fab', 'fab-mini', 'flat', 'raised'];
    var iconAligns: Array<string> = ['left', 'right'];
    var fabPositions: Array<string> = [
        'top-right',
        'top-center',
        'top-left',
        'center-right',
        'center-center',
        'center-left',
        'bottom-right',
        'bottom-center',
        'bottom-left'
    ];
    var buttons: Array<Blend.material.Material> = [];

    var createWrapper = function(): Blend.dom.Element {
        return Blend.createElement({
            cls: ['t-wrapper'],
            style: {
                border: '1px solid gray',
                position: 'relative',
                height: 200,
                margin: 5,
                padding: 5,
            },
            children: []
        });
    }

    buttonTypes.forEach(function(buttonType: string) {

        var wrapper = createWrapper();

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

    ['fab', 'fab-mini'].forEach(function(fabType: string) {
        var wrapper = createWrapper();
        fabPositions.forEach(function(fabPos: string) {
            var button = new Blend.button.Button(<ButtonInterface>{
                buttonType: fabType,
                icon: fa_icon,
                fabPosition: fabPos
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