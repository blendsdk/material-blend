TestApp.defineTest("Blend Singleton", function (t: Blend.testing.TestRunner) {

    var col1 = new Blend.Collection();
    t.assertEquals(col1.countItems(), 0, "collection is ok");

    var col2 = new Blend.Collection<string>(["one", "two", "three"]);
    t.assertEquals(col2.countItems(), 3, "collection count is 3");
    t.assertEquals(col2.indexOf("two"), 1, "indexOf OK");

    var col3 = new Blend.Collection<string>(["one", "two", "three"]);
    col3.remove(1);
    t.assertEquals(col3.indexOf("three"), 1, "remove OK");

    var col4 = new Blend.Collection<string>(["one", "two", "three"]);
    col4.insertAt(2, "two and half");
    t.assertEquals(col4.indexOf("three"), 3, "insertAt OK");

    class MyCollection implements CollectionProviderInterface<string> {

        protected col: Blend.Collection<string>;

        clearItems: () => void;
        countItems: () => number = null;
        indexOf: (item: string) => number;
        getItems: () => Array<string>;
        itemAtIndex: (index: number) => string;
        add: (item: string | Array<string>) => void = null;
        remove: (item: string | number) => void;
        insertAt: (index: number, item: string) => void;
        forEach: (callback: (item: string, index?: number) => void) => void;

        public constructor() {
            var me = this;
            me.col = new Blend.Collection([], me);
            me.col.mixin();
        }

    }

    var col5 = new MyCollection();
    col5.add(["one", "two"]);
    t.assertEquals(col5.countItems(), 2, "mixin OK");

    t.done();

});