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
        controller: function(sender: Blend.ui.View, event: string, alias: string, mediaQuery: any) {
            var col: number;
            if (sender !== this && event === 'responsiveChanged') {
                switch (alias) {
                    case Blend.eMediaQuery.SMALL: col = 12;
                        break;
                    case Blend.eMediaQuery.MEDIUM: col = 3;
                        break;
                    default:
                        col = 4;
                }
                sender.setGridColumn(col);
                sender.getElement().setHtml(alias);
                console.log(mediaQuery);
            }
        },
        items: [
            {
                ctype: 'ui.rect',
                color: '#ededed',
                responsive: true,
                grid: {
                    row: 0,
                    col: 4
                }
            },
            {
                ctype: 'ui.rect',
                color: '#dedede',
                responsive: true,
                grid: {
                    row: 0,
                    col: 4
                }
            },
            {
                ctype: 'ui.rect',
                color: '#ebebeb',
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