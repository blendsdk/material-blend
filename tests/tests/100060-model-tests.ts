/// <reference path="../blend/blend.d.ts" />

TestApp.defineTest('Model Binding Tests', function(t: Blend.testing.TestRunner) {

    class Logger extends Blend.Component {

        public logs: Array<string> = [];

        public log(msg: string) {
            this.logs.push(msg);
        }
    }

    var logger = new Logger();
    var person = new Blend.mvc.Model({
        fullname: null,
    });
    Blend.Runtime.Binder.bind(person, logger, 'setFullname', 'log', 'getFullname');
    person.setData({
        fullname: 'Superman'
    });

    t.assertEquals(logger.logs, ['Superman'], 'model bound');

    t.done();

});