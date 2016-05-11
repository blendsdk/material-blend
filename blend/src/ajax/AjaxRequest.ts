/// <reference path="../Blend.ts" />
/// <reference path="../Component.ts" />

namespace Blend.ajax {

    export class AjaxRequest extends Blend.Component {

        protected config: AjaxRequestInterface;

        public constructor(config: string | AjaxRequestInterface) {
            var cfg: AjaxRequestInterface;
            if (Blend.isString(config)) {
                cfg = {
                    url: <string>config || null,
                    method: 'POST'
                }
            } else {
                cfg = <AjaxRequestInterface>config
            }
            super(cfg);
            var me = this;
            me.config = {
                url: cfg.url || null,
                method: cfg.method || 'POST'
            }
        }

        protected createGetURI(data: DictionaryInterface = {}) {
            var me = this,
                payload:Array<string> = [],
                url: string;
            Blend.forEach(data, function(value: any, key: string) {
                payload.push(`${key}=${me.encodeURIComponent(value)}`);
            });
            return (me.config.url
                + (me.config.url.indexOf('?') === -1 ? '?' : '')
                + payload.join('&')).trim();
        }

        public sendRequest(data: DictionaryInterface = {},onSucess:Function,onError:Function,onFinally) {
            var me = this;
            if (me.config.method === 'POST') {

            } else {

            }
        }

        private encodeURIComponent(value:string) {
            return encodeURIComponent(value).replace(/[!'()*]/g, function(c) {
                return '%' + c.charCodeAt(0).toString(16);
            });
        }
    }

}