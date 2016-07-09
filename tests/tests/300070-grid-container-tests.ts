TestApp.defineTest("Grid Container", function (t: Blend.testing.TestRunner) {

    var me = this,
        bodyEl = Blend.getElement(document.body);
    bodyEl.clearElement();

    var mkRect = function (color: string, config: GridColumnConfigInterface): MaterialInterface {
        return <MaterialInterface>{
            ctype: "mb.rect",
            grid: config,
            height: 100,
            color: color
        };
    };

    var testTests = [
        {
            items: function () {
                return [
                    mkRect("red", { small: 4, medium: 8, large: 12 }),
                    mkRect("blue", { small: 4, medium: 8, large: 12 }),
                    mkRect("orange", { small: 4, medium: 8, large: 12 })
                ];
            },
            tests: [
                {
                    size: 320,
                    descr: "screen 320 fullsize",
                    testFn: function (bounds: Array<ElementBoundsInterface>, descr: string) {
                        bounds.forEach(function (item: ElementBoundsInterface) {
                            t.assertEquals(item.width, 302, descr);
                        });
                    }
                },
                {
                    size: 768,
                    descr: "screen 768 fullsize",
                    testFn: function (bounds: Array<ElementBoundsInterface>, descr: string) {
                        bounds.forEach(function (item: ElementBoundsInterface) {
                            t.assertEquals(item.width, 750, descr);
                        });
                    }
                },
                {
                    size: 1280,
                    descr: "screen 1280 fullsize",
                    testFn: function (bounds: Array<ElementBoundsInterface>, descr: string) {
                        bounds.forEach(function (item: ElementBoundsInterface) {
                            t.assertEquals(item.width, 1254, descr);
                        });
                    }
                }
            ]
        },
        {
            items: function () {
                return [
                    mkRect("red", { small: 4, medium: 4, large: 8 }),
                    mkRect("black", { small: 1, medium: 4, large: 3 }),
                    mkRect("blue", { small: 3, medium: 8, large: 1 })
                ];
            },
            tests: [
                {
                    size: 320,
                    descr: "screen 320 gutter",
                    testFn: function (bounds: Array<ElementBoundsInterface>, descr: string) {
                        t.assertEquals(bounds[0].width, ((318 / 4) * 4) - 16, descr);
                        t.assertEquals(bounds[1].width, ((318 / 4) * 1) - 16, descr);
                        t.assertEquals(bounds[2].width, ((318 / 4) * 3) - 16, descr);
                    }
                },
                {
                    size: 768,
                    descr: "screen 768 gutter",
                    testFn: function (bounds: Array<ElementBoundsInterface>, descr: string) {
                        t.assertEquals(bounds[0].width, ((766 / 8) * 4) - 16, descr);
                        t.assertEquals(bounds[1].width, ((766 / 8) * 4) - 16, descr);
                        t.assertEquals(bounds[2].width, ((766 / 8) * 8) - 16, descr);
                    }
                },
                {
                    size: 1280,
                    descr: "screen 1280 gutter",
                    testFn: function (bounds: Array<ElementBoundsInterface>, descr: string) {
                        t.assertEquals(bounds[0].width, ((1278 / 12) * 8) - 24, descr);
                        t.assertEquals(bounds[1].width, ((1278 / 12) * 3) - 24, descr);
                        t.assertEquals(bounds[2].width, ((1278 / 12) * 1) - 24, descr);
                    }
                }
            ]
        },
        {
            items: function () {
                return [
                    mkRect("red", { large: 4 }), // 0
                    mkRect("green", { large: 4 }), // 1
                    mkRect("blue", { large: 4 }), // 2
                    mkRect("magenta", <GridContainerInterface>{ // 3
                        large: {
                            size: 4,
                            offset: 4
                        }
                    }),
                ];
            },
            tests: [
                {
                    size: 1280,
                    descr: "screen 1280 offset",
                    testFn: function (bounds: Array<ElementBoundsInterface>, descr: string) {
                        t.assertEquals(bounds[1].left, bounds[3].left, descr);
                    }
                }
            ]
        }
    ];

    var testQueue: Array<Function> = [];

    testTests.forEach(function (testSet: any) {

        testSet.tests.forEach(function (test: any) {

            var gridContainer = new Blend.container.Grid({
                items: testSet.items(),
                width: test.size,
                height: 100,
                style: {
                    display: "inline-block",
                    border: "1px solid grey"
                }
            });

            bodyEl.append(gridContainer.getElement());
            gridContainer.doInitialize();
            gridContainer.performLayout();

            testQueue.push(function () {
                var bounds: Array<ElementBoundsInterface> = [];
                Blend.selectElements(".mb-rectangle", gridContainer.getElement()).forEach(function (el: Blend.dom.Element) {
                    bounds.push(el.getBounds());
                });
                test.testFn.apply(me, [bounds, test.descr]);
            });

        });
    });

    Blend.delay(500, me, function () {
        testQueue.forEach(function (test: Function) {
            test();
        });

        t.done(250);
    });

});
