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
        controller: function(sender: Blend.ui.View, event: string, alias: string, mediaQuery: string) {
            if (sender !== this && event === 'responsiveChanged') {
                switch (alias) {
                    case eMediaQuery.SMALL: sender.getElement().setData('grid-column', 12);
                        break;
                    case eMediaQuery.MEDIUM : sender.getElement().setData('grid-column', 3);
                        break;
                    default:
                        sender.getElement().setData('grid-column', 4);
                }
                sender.getElement().setHtml(alias);
            }
        },
        items: [
            {
                ctype: 'ui.rect',
                color: 'red',
                responsive: true,
                grid: {
                    row: 0,
                    col: 4
                }
            },
            {
                ctype: 'ui.rect',
                color: 'blue',
                responsive: true,
                grid: {
                    row: 0,
                    col: 4
                }
            },
            {
                ctype: 'ui.rect',
                color: 'orange',
                responsive: true,
                grid: {
                    row: 0,
                    col: 4
                }
            }
        ]
    }
});
app.run();