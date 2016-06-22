TestApp.defineTest('MVC create controller', function(t: Blend.testing.TestRunner) {

    class Controller1 extends Blend.mvc.Controller {
    }

    var view1: any = Blend.createComponent(Blend.mvc.View, {
        controller: Controller1
    });

    var view2: any = Blend.createComponent(Blend.mvc.View, {
        controller: new Controller1()
    });

    Blend.registerClassWithAlias('my.controller1', Controller1);

    var view3: any = Blend.createComponent(Blend.mvc.View, {
        controller: 'my.controller1'
    });

    var view4: any = Blend.createComponent(Blend.mvc.View, {
        controller: function() {

        }
    });

    t.assertEquals(view1.controllers.length, 1, 'Controller by class type');
    t.assertEquals(view2.controllers.length, 1, 'Controller by instance');
    t.assertEquals(view3.controllers.length, 1, 'Controller by registery');
    t.assertEquals(view4.controllers.length, 1, 'Controller by function');

    t.done();

});

TestApp.defineTest('MVC fire event', function(t: Blend.testing.TestRunner) {

    class Controller1 extends Blend.mvc.Controller {

        protected initEvents() {
            var me = this;
            me.on('log', me.log);
        }

        protected log(view: Blend.mvc.View, message: string) {
            (<any>view).log = message;
        }
    }

    var view1: any = Blend.createComponent(Blend.mvc.View, {
        controller: Controller1
    });

    var view2: any = Blend.createComponent(Blend.mvc.View, {
        controller: function(view: any, evname: string, message: string) {
            if (evname === 'log') {
                view.log = message.toUpperCase();
            }
        }
    });


    var fnControllerCalled: boolean = false;
    var context = new Blend.mvc.Context();
    context.addController([Controller1,function() {
        fnControllerCalled = true;
    }]);

    var view3: any = Blend.createComponent(Blend.mvc.View, {
        context:context
    });

    view1.enableEvents().fireEvent('log', 'test1');
    view2.enableEvents().fireEvent('log', 'test2');
    view3.enableEvents().fireEvent('log', 'test3');

    t.delay(function() {

        t.assertEquals(view1.log, 'test1','controller as class');
        t.assertEquals(view2.log, 'TEST2', 'controller as function');
        t.assertEquals(view3.log, 'test3', 'controller as context class');
        t.assertTrue(fnControllerCalled, 'controller as function in context');

        t.done();

    }, 250);


});