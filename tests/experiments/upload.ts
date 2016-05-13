/// <reference path="../blend/blend.d.ts" />

function startUpload() {

    var myFiles = Blend.getElement(document.getElementById('myFiles'));
    var progressLabel = Blend.getElement(document.getElementById('progressLabel'));
    console.log(myFiles);
    var ax = new Blend.ajax.AjaxPostRequest(<AjaxRequestInterface>{
        url: '/upload.php?cmd=upload',
        onProgress: function(evt: ProgressEvent) {
            console.log('onProgress', evt)
        },
        onFailed: function(evt: Event) {
            console.log('onFailed', evt)
        },
        onSuccess: function(r: XMLHttpRequest, evt: Event) {
            console.log('onSuccess', evt)
            progressLabel.setHtml(r.responseText);
        },
        onComplete: function(evt: Event) {
            console.log('onComplete', evt)
        },
        onPrepareUpload: function(file: File, status: number) {
            var statusText: any = {
                0: 'START',
                1: 'PREPARING',
                2: 'DONE'
            }
            progressLabel.setHtml(statusText[status] + ' ' + file.name);
        }
    });
    ax.sendRequest({
        files1: myFiles.getFiles()
    });

}