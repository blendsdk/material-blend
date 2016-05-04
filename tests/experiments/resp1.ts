/// <reference path="../blend/blend.d.ts" />

var app = new Blend.web.Application({
    responsive: true,
    responseTo: ['(min-width:1024px)'],
    mainView: {
        ctype: 'ui.rect',
        color: '#EDEDED',
        responsive: true,
        responseTo: ['(min-width:320px)', '(min-width:768px)', '(min-width:1024px)'],
        controller: function(view: any, event: string) {
            if (event === 'responsiveChanged') {
                console.log("RECT", arguments);
            }
        }
    },
    controller: function(view: any, event: string) {
        if (view === this && event === 'responsiveChanged') {
            console.log("App", arguments);
        }
    }
});
console.clear();
app.run();