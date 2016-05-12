/// <reference path="../blend/blend.d.ts" />

TestApp.defineTest('AjaxRequest Sanity', function(t: Blend.testing.TestRunner) {

    class AjaxRequestTest extends Blend.ajax.AjaxGetRequest {

        public getURL(): string {
            return this.url;
        }

        public t_createGetURI(data: DictionaryInterface) {
            return this.createGetURI(data);
        }
    }

    var ax1 = new AjaxRequestTest({
        url: '/ajax1.php'
    });
    t.assertEquals(ax1.getURL(), '/ajax1.php', 'ax1 config correct');
    //////////////////////////////////////////////////////////////////////////////////

    var ax2 = new AjaxRequestTest('/ajax2.php');
    t.assertEquals(ax2.getURL(), '/ajax2.php', 'ax1 config correct');
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
            t.assertEquals(request.status, 500, 'got 500');
        }
        ,
        onComplete: function() {
            t.done(500);
        }
    });
    test500.sendRequest();
});

TestApp.defineTest('Ajax Get Echo', function(t: Blend.testing.TestRunner) {

    var test = new Blend.ajax.AjaxGetRequest(<AjaxRequestInterface>{
        url: '/ajax.php?cmd=get-echo-test',
        onSuccess: function(request: XMLHttpRequest) {
            t.assertEquals(request.responseText, 'Hello Blend!', 'call success');
        },
        onComplete: function(request: XMLHttpRequest) {
            if (request.status === 200) {
                t.done();
            } else {
                t.assertTrue(false, 'call failed' + request.statusText);
            }
        }
    });
    test.sendRequest({
        name: 'Blend!'
    });
});


TestApp.defineTest('Progress Event Attributes', function(t: Blend.testing.TestRunner) {

    var test = new Blend.ajax.AjaxGetRequest(<AjaxRequestInterface>{
        url: '/ajax.php?cmd=get-echo-test',
        onProgress: function name(reqiest: XMLHttpRequest, evt: ProgressEvent) {
            if (evt.lengthComputable !== undefined && evt.loaded !== undefined && evt.total !== undefined) {
                t.assertTrue(true, 'Progress Event Supported')
            }
        },
        onComplete: function(request: XMLHttpRequest) {
            t.done();
        }
    });
    test.sendRequest({
        name:''
    });
});