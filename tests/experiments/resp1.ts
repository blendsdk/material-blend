/// <reference path="../blend/blend.d.ts" />

// var app = new Blend.web.Application({
//     responsive: true,
//     responseTo: ['(min-width:1024px)'],
//     mainView: {
//         ctype: 'ui.rect',
//         color: '#EDEDED',
//         responsive: true,
//         responseTo: ['(min-width:320px)', '(min-width:768px)', '(min-width:1024px)'],
//         controller: function(view: any, event: string) {
//             if (event === 'responsiveChanged') {
//                 console.log("RECT", arguments);
//             }
//         }
//     },
//     controller: function(view: any, event: string) {
//         if (view === this && event === 'responsiveChanged') {
//             console.log("App", arguments);
//         }
//     }
// });
var app = new Blend.web.Application({
    mainView: {
        ctype: 'layout.grid',
        controller: function(sender: Blend.ui.View, event: string, mediaQuery: string) {
            if (sender !== this && event === 'responsiveChanged') {
                console.log(arguments);
                if (mediaQuery === '(min-width:319px)') {
                    sender.getElement().removeCssClass('grd-c6');
                    sender.getElement().addCssClass('grd-c12');
                } else {
                    sender.getElement().removeCssClass('grd-c12');
                    sender.getElement().addCssClass('grd-c6');
                }
            }
        },
        items: [
            {
                ctype: 'ui.rect',
                color: 'red',
                responsive: true,
                responseTo:['(min-width:319px)','(min-width:767px)'],
                grid: {
                    row: 0,
                    col: 6
                }
            },
            {
                ctype: 'ui.rect',
                color: 'orange',
                responsive: true,
                responseTo:['(min-width:319px)','(min-width:767px)'],
                grid: {
                    row: 0,
                    col: 6
                }
            }
        ]
    }
});
app.run();