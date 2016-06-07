/**
 * Copyright 2016 TrueSoftware B.V. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/// <reference path="../Blend.ts" />
/// <reference path="../Component.ts" />

namespace Blend.ajax {

    /**
     * Base class for an Ajax Request
     */
    export abstract class AjaxRequest extends Blend.Component {

        protected xhr: XMLHttpRequest;
        protected xhrConfig: DictionaryInterface;
        protected url: string;
        protected headers: DictionaryInterface;
        protected onComplete: Function;
        protected onProgress: Function;
        protected onFailed: Function;
        protected onSuccess: Function;
        protected onStart: Function;
        protected onPrepareUpload: Function;
        protected scope: any;
        protected callID: number;

        protected abstract doSendRequest(data: DictionaryInterface): void

        public constructor(config: string | AjaxRequestInterface) {
            super();
            var me = this, cfg: AjaxRequestInterface;
            if (Blend.isString(config)) {
                cfg = {
                    url: <string>config || null
                };
            } else {
                cfg = <AjaxRequestInterface>config;
            }
            me.url = cfg.url || null;
            me.headers = cfg.headers || {};
            me.onComplete = cfg.onComplete || null;
            me.onProgress = cfg.onProgress || null;
            me.onFailed = cfg.onFailed || null;
            me.onSuccess = cfg.onSuccess || null;
            me.onStart = cfg.onStart || null;
            me.onPrepareUpload = cfg.onPrepareUpload || null;
            me.scope = cfg.scope | <any>me;
            me.xhrConfig = {
                withCredentials: cfg.withCredentials === true ? true : false
            };
            me.initialize();
        }

        protected initialize() {
            var me = this, handlers: DictionaryInterface = {
                progress: me.updateProgress,
                load: me.transferComplete,
                error: me.transferFailed,
                abort: me.transferCanceled
            };
            me.xhr = new XMLHttpRequest();
            Blend.forEach(handlers, function(handler: Function, eventName: string) {
                me.xhr.addEventListener(eventName, function(evt: Event) {
                    handler.apply(me, [me.xhr, evt]);
                });
            });
            Blend.forEach(me.headers, function(value: string, header: string) {
                me.xhr.setRequestHeader(header, value);
            });
            Blend.forEach(me.xhrConfig, function(value: any, key: string) {
                (<any>me.xhr)[key] = value;
            });
        }

        public sendRequest(data: DictionaryInterface = {}) {
            var me = this;
            me.callID = (new Date()).getTime();
            if (me.callHandler("onStart", arguments) !== false) {
                me.doSendRequest(data);
            } else {
                me.transferCanceled(me.xhr, null);
            }
        }

        protected updateProgress(request: XMLHttpRequest, evt: Event) {
            var me = this;
            me.callHandler("onProgress", arguments);
        }

        protected transferComplete(request: XMLHttpRequest, evt: Event) {
            var me = this;
            if (request.status >= 300) {
                me.transferFailed.apply(me, arguments);
            } else if (request.status < 300) {
                me.callHandler("onSuccess", arguments);
            }
            me.callHandler("onComplete", arguments);
        }

        protected transferFailed(request: XMLHttpRequest, evt: Event) {
            var me = this;
            me.callHandler("onFailed", arguments);
        }

        protected transferCanceled(request: XMLHttpRequest, evt: Event) {
            var me = this;
            me.transferFailed(request, evt);
        }

        /**
         * File prepare event notification
         */
        protected notifyPrepareUpload(file: File, status: number) {
            this.callHandler("onPrepareUpload", arguments);
        }

        /**
         * Calls a registerend handler by name
         */
        private callHandler(name: string, args: IArguments) {
            var me = this;
            if ((<any>me)[name]) {
                return (<Function>(<any>me)[name]).apply(me.scope || me, args);
            } else {
                return undefined;
            }
        }

        /**
         * URI encode a string value
         */
        protected encodeURIComponent(value: string) {
            return encodeURIComponent(value).replace(/[!'()*]/g, function(c) {
                return "%" + c.charCodeAt(0).toString(16);
            });
        }

        /**
         * URL encode a Dictionary
         */
        protected urlEncodeData(data: DictionaryInterface): string {
            var me = this, payload: Array<string> = [];
            Blend.forEach(data, function(value: any, key: string) {
                payload.push(`${key}=${me.encodeURIComponent(value)}`);
            });
            return payload.join("&").trim();
        }

        /**
         * Creates or updates the current URL by adding a call ID ti bypass browser caching
         */
        protected createURI(data: DictionaryInterface = {}) {
            var me = this;
            data = data || {};
            data["_c"] = me.callID;
            return (me.url
                + (me.url.indexOf("?") === -1 ? "?" : "&")
                + me.urlEncodeData(data));
        }

    }

}