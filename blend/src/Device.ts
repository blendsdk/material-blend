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

namespace Blend {

    /**
     * Provides utility functions to help recognize if the current
     * running device is a mobile or a tablet
     */
    export class Device {

        public isAndroid(): boolean {
            return navigator.userAgent.match(/Android/i) !== null;
        }

        public isBlackBerry() {
            return navigator.userAgent.match(/BlackBerry/i) !== null;
        }

        public isiPad(): boolean {
            return navigator.userAgent.match(/iPad/i) !== null;
        }

        public isiPhone(): boolean {
            return navigator.userAgent.match(/iPhone/i) !== null;
        }

        public isiOS(): boolean {
            return navigator.userAgent.match(/iPhone|iPad/i) !== null;
        }

        isOpera(): boolean {
            return navigator.userAgent.match(/Opera Mini/i) !== null;
        }

        isWindows(): boolean {
            return navigator.userAgent.match(/IEMobile/i) !== null;
        }

        public isMobile(): boolean {
            var me = this;
            return (me.isAndroid() || me.isBlackBerry() || me.isiOS() || me.isOpera() || me.isWindows());
        }
    }
}