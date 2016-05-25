/// <reference path="../blend/blend.d.ts" />


Blend.Runtime.ready(function() {

    Blend.DEBUG = true;

    var bodyEl = Blend.getElement(document.body);
    var fa_icon = 'face';
    var buttonTypes: Array<string> = ['flat', 'raised'];
    var iconAligns: Array<string> = ['left', 'right'];

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

        wrapper.append(new Blend.button.Button({
            text: buttonType.ucfirst(),
            buttonType: buttonType,
        }).getElement());

        wrapper.append(new Blend.button.Button({
            icon: fa_icon,

        }).getElement());


        iconAligns.forEach(function(iconAlign: string) {

            var button = new Blend.button.Button(<ButtonInterface>{
                iconAlign: iconAlign,
                text: buttonType.ucfirst(),
                buttonType: buttonType,
                icon: fa_icon,
            });
            (<any>window)
            wrapper.append(button.getElement());

        });

        bodyEl.append(wrapper);

    });

}).kickStart();