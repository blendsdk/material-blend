TestApp.defineTest('Component Binding', function(t: Blend.testing.TestRunner) {

    var classnum = 0;

    class Person extends Blend.Component {

        private firstname: string;
        private lastname: string;
        private index = 0;

        public constructor(config: any = {}) {
            super(config);
            this.index = (++classnum);
            Blend.apply(this, config);
        }

        public setFirstname(value: string): Person {
            this.firstname = value;
            return this;
        }

        public getFirstname():string {
            return this.firstname;
        }

        public setLastname(value: string): Person {
            this.lastname = value;
            return this;
        }

        public getLastname():string {
            return this.lastname;
        }

        public  getFullname() {
            return `${this.firstname} ${this.lastname}`;
        }

    }

    var binder = new Blend.binding.BindingProvider();

    var p1 = new Person({ firstname: 'Johnny', lastname: 'Bravo' });
    var p2 = new Person({ firstname: 'Jane', lastname: 'Bravo' });
    var p3 = new Person({ firstname: 'Sally', lastname: 'Biggs' })
    var p4 = new Person({ firstname: 'Peter', lastname: 'Peters' })

    t.assertEquals(p1.getFullname(), 'Johnny Bravo');
    t.assertEquals(p2.getFullname(), 'Jane Bravo');

    binder.bindProperty(p1, p2, 'lastname');
    binder.bindProperty(p1, p3, 'lastname');
    binder.bindProperty(p1, p4, 'lastname');
    binder.bindProperty(p1, p4, 'lastname','firstname');


    p1.setLastname('Sanders');

    t.assertEquals(p1.getFullname(), 'Johnny Sanders',p1.getFullname());
    t.assertEquals(p2.getFullname(), 'Jane Sanders',p2.getFullname());
    t.assertEquals(p3.getFullname(), 'Sally Sanders', p3.getFullname());
    t.assertEquals(p4.getFullname(), 'Sanders Sanders', p4.getFullname());

    t.done();

});


TestApp.defineTest('Component Free Binding', function(t: Blend.testing.TestRunner) {

    class Worker extends Blend.Component {
        public doWork(item: string) {
            return item.toUpperCase();
        }

        public timestamp(item: string) {
            return item + '@time';
        }

    }

    class Logger extends Blend.Component {

        protected messages: Array<string> = [];

        public log(msg: string) {
            this.messages.push(msg);
        }

        public getLogs() {
            return this.messages;
        }

    }

    var worker = new Worker();
    var logger = new Logger();
    var binder = new Blend.binding.BindingProvider();

    binder.bind(worker, logger, 'doWork', 'log', null);
    worker.doWork('w1');
    worker.doWork('w2');
    t.assertEquals(logger.getLogs(), ['W1', 'W2'], '2 items logged');

    binder.bind(worker, logger, 'doWork', 'log', 'timestamp');
    worker.doWork('w3');
    t.assertEquals(logger.getLogs(), ['W1', 'W2','W3','W3@time'], '3 items logged');

    t.done();

});