/// <reference path="../blend/blend.d.ts" />


Blend.Runtime.ready(function() {

    Blend.DEBUG = true;
    var bodyEl = Blend.getElement(document.body);

    var createSurface = function(name: string, style: StyleInterface = {}): Blend.dom.Element {
        var el: Blend.dom.Element = Blend.createElement({
            cls: ['debug-surface'],
            style: style,
            children: [
                {
                    tag: 'p',
                    text: name,
                    cls: ['title']
                },
                {
                    tag: 'div',
                    cls: 'body'
                }
            ]
        });
        bodyEl.append(el);
        return Blend.getElement(<HTMLElement>el.getEl().children[1]);
    };

    var createButton = function(surface: Blend.dom.Element, config: ButtonInterface) {
        var btn = new Blend.button.Button(config);
        surface.append(btn.getElement())
        btn.doInitialize();
    }

    var createRippleTest = function(surface: Blend.dom.Element) {
        var el = Blend.createElement({
            style: {
                width: 200,
                height: 100,
                position: 'relative',
                display: 'inline-block',
                border: '1px solid #EFEFEF'
            }
        })
        surface.append(el);
        var rippleEffect = new Blend.material.effect.Ripple({
            element: el,
        })
    }

    var surface = createSurface('Ripple Test', {
    })

    createRippleTest(surface);

    var btn = createButton(surface, {
        text: 'Flat Button',
        buttonType: 'flat',
        icon: 'build'
    });

    var btn = createButton(surface, {
        text: 'Raised Button',
        buttonType: 'raised',
        theme: 'primary'
    });

    var btn = createButton(surface, {
        buttonType: 'round-flat',
        icon: 'done',
    });

    var btn = createButton(surface, {
        buttonType: 'round-raised',
        icon: 'mood',
        iconSize: 'xlarge'
    });

    var btn = createButton(surface, {
        buttonType: 'fab',
        icon: 'replay',
        fabPosition: 'center-right',
        theme: 'pink'
    });


}).kickStart();