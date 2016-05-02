/// <reference path="../blend/blend.d.ts" />

var app = new Blend.web.Application({
    mainView: 'ui.rect',
    controller: function(view: any, event: string,model:string) {
        if (event === 'responsiveChanged') {
            console.log(model);
        }
    }
});
app.run();