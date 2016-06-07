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
/// <reference path="AjaxRequest.ts" />

namespace Blend.ajax {

    /**
     * AjaxPostRequest implements a POST request with File uploading capabilities
     */
    export class AjaxPostRequest extends Blend.ajax.AjaxRequest {

        protected boundary: string;
        protected dataItemHeader: string;
        protected readyToSend: boolean;

        protected doSendRequest(data: DictionaryInterface = {}) {
            var me = this;
            me.readyToSend = true;
            me.boundary = '!!@@##' + me.callID + '##@@!!';
            me.dataItemHeader = `--${me.boundary}\r\nContent-Disposition: form-data;`;
            me.xhr.open('POST', me.createURI(), true);
            me.xhr.setRequestHeader("Content-Type", "multipart\/form-data; boundary=" + me.boundary);
            me.boundaryEncodeData(data, function(encodedData: string) {
                me.xhr.setRequestHeader("Content-Length", encodedData.length.toString());
                me.xhr.sendAsBinary(encodedData);
            });
        }

        /**
         * Encode the data that is to be sent (POST) asynchronously
         */
        protected boundaryEncodeData(data: DictionaryInterface, callback: Function) {
            var me = this,
                pendingConverts: number = 0,
                payload: Array<string> = []
            Blend.forEach(data, function(value: any, key: string) {
                if (Blend.isInstanceOf(value, FileList)) {
                    pendingConverts += me.encodeFileList(<FileList>value, payload, function() {
                        pendingConverts -= 1;
                    });
                } else {
                    payload.push(me.encodeDataItem(key, value));
                }
            });
            var waitId = setInterval(function() {
                if (pendingConverts === 0) {
                    clearInterval(waitId);
                    payload.push(`--${me.boundary}--\r\n`);
                    callback.apply(me, [payload.join('')]);
                }
            }, 250);
        }

        /**
         * Converts an ArrayBuffer (File) to a string
         */
        private arrayBufferToString = function(result: Array<number>): string {
            var binary = "";
            var bytes = new Uint8Array(result);
            var length = bytes.byteLength;
            for (var i = 0; i < length; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return binary;
        };

        /**
         * Encodes a FileList
         */
        private encodeFileList(files: FileList, payload: Array<string>, onFinish: Function): number {
            var me = this,
                currentFile: File,
                filetype: string,
                nextFile: number = 0,
                reader: FileReader = new FileReader();
            reader.onload = function(evt: Event) {
                filetype = currentFile.type === '' ? 'application/octet-stream' : currentFile.type;
                payload.push(`${me.dataItemHeader} name="${currentFile.name}"; filename="${currentFile.name}"\r\nContent-Type: ${filetype}\r\n\r\n${me.arrayBufferToString(reader.result)}\r\n`);
                onFinish.apply(me, []);
                me.notifyPrepareUpload(currentFile, 2);
                nextFile += 1;
                doWork();
            }
            reader.onprogress = function(evt: Event) {
                me.notifyPrepareUpload(currentFile, 1);
            }
            var doWork = function() {
                if (files[nextFile]) {
                    currentFile = files[nextFile];
                    me.notifyPrepareUpload(currentFile, 0);
                    reader.readAsArrayBuffer(currentFile);
                }
            }
            doWork();
            return files.length;
        }

        /**
         * Encodes simple data items
         */
        private encodeDataItem(key: string, value: any) {
            var me = this;
            return `${me.dataItemHeader} name="${key}"\r\n\r\n${value}\r\n`;
        }
    }
}