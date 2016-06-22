TestApp.defineTest("Container", function (t: Blend.testing.TestRunner) {

    class TestConatier extends Blend.container.Container {
        public getItems(): Array<Blend.material.Material> {
            return this.items;
        }
    }

    var c1 = new TestConatier();
    t.assertEquals(c1.getItems().length, 0, "no items");

    var c2 = new TestConatier({
        items: [
            "mb.rect"
        ]
    });
    t.assertEquals(c2.getItems().length, 1, "1  string item");

    var c3 = new TestConatier({
        items: [
            {
                ctype: "mb.rect"
            }
        ]
    });
    t.assertEquals(c3.getItems().length, 1, "1 config item");

    t.done();

});