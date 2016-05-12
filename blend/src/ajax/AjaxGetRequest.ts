/// <reference path="../Blend.ts" />
/// <reference path="AjaxRequest.ts" />

namespace Blend.ajax {

    export class AjaxGetRequest extends Blend.ajax.AjaxRequest {

        protected doSendRequest(data: DictionaryInterface = {}) {
            var me = this;
            me.xhr.open('GET', me.createURI(data), true);
            me.xhr.send(null);
        }
    }

}