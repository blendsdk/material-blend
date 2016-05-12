/// <reference path="../Blend.ts" />
/// <reference path="AjaxRequest.ts" />

namespace Blend.ajax {

    export class AjaxPostRequest extends Blend.ajax.AjaxRequest {

        protected boundary: string;

        protected doSendRequest(data: DictionaryInterface = {}) {
            var me = this;
            me.boundary = '!!@@##' + me.callID + '##@@!!';
            me.xhr.open('POST', me.createURI(), true);
            me.xhr.setRequestHeader("Content-Type", "multipart\/form-data; boundary=" + me.boundary);
            me.xhr.sendAsBinary(me.boundaryEncodeData(data));
        }

        protected boundaryEncodeData(data: DictionaryInterface): string {
            var me = this, payload: Array<string> = [];
            Blend.forEach(data, function(value: any, key: string) {
                payload.push(me.encodeDataItem(key, value));
            });
            payload.push(`--${me.boundary}--\r\n`);
            return payload.join('').trim();
        }

        private encodeDataItem(key: string, value: string) {
            var me = this;
            return `--${me.boundary}\r\nContent-Disposition: form-data; name="${key}"\r\n\r\n${value}\r\n`
        }
    }
}