/// <reference path="../blend/blend.d.ts" />

TestApp.defineTest('AjaxRequest Sanity', function(t: Blend.testing.TestRunner) {

    class AjaxRequestTest extends Blend.ajax.AjaxGetRequest {

        public getConfig(): AjaxRequestInterface {
            return this.config;
        }

        public t_createGetURI(data: DictionaryInterface) {
            return this.createGetURI(data);
        }
    }

    var ax1 = new AjaxRequestTest({
        url: '/ajax1.php'
    });
    t.assertEquals(ax1.getConfig().url, '/ajax1.php', 'ax1 config correct');
    //////////////////////////////////////////////////////////////////////////////////

    var ax2 = new AjaxRequestTest('/ajax2.php');
    t.assertEquals(ax2.getConfig().url, '/ajax2.php', 'ax1 config correct');
    //////////////////////////////////////////////////////////////////////////////////

    var ax3 = new AjaxRequestTest('/file.php');
    var url = ax3.t_createGetURI({
        hello: 'world',
        one: 1,
        spaces: 'this is a test'
    });
    t.assertEquals(url, '/file.php?hello=world&one=1&spaces=this%20is%20a%20test', 't_createGetURI');
    t.done();

});

TestApp.defineTest('AJAX 404', function(t: Blend.testing.TestRunner) {

    var test404 = new Blend.ajax.AjaxGetRequest(<AjaxRequestInterface>{
        url: '/404.php',
        onFailed: function(request: XMLHttpRequest) {
            t.assertEquals(request.status, 404, 'Got 404');
        }
        ,
        onComplete: function() {
            t.done();
        }
    });
    test404.sendRequest();
});

TestApp.defineTest('AJAX 500', function(t: Blend.testing.TestRunner) {

    var test500 = new Blend.ajax.AjaxGetRequest(<AjaxRequestInterface>{
        url: '/500.php',
        onFailed: function(request: XMLHttpRequest) {
            t.assertEquals(request.status, 500);
        }
        ,
        onComplete: function() {
            t.done();
        }
    });
    test500.sendRequest();
});