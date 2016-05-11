/// <reference path="../Blend.ts" />
/// <reference path="AjaxRequest.ts" />

namespace Blend.ajax {

    export class AjaxGetRequest extends Blend.ajax.AjaxRequest {

        public constructor(config: string | AjaxRequestInterface) {
            super(config);
        }

        protected doSendRequest(data: DictionaryInterface = {}) {
            var me = this;
            me.xhr.open('GET', me.createGetURI(data), true);
            me.xhr.send(null);
        }

        protected createGetURI(data: DictionaryInterface = {}) {
            var me = this,
                payload: Array<string> = [],
                url: string;
            Blend.forEach(data, function(value: any, key: string) {
                payload.push(`${key}=${me.encodeURIComponent(value)}`);
            });
            return (me.config.url
                + (me.config.url.indexOf('?') === -1 ? '?' : '&')
                + payload.join('&')).trim();
        }

    }

}