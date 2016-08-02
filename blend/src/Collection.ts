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
     * This class implements a basic collection that can hold items
     * of type <T>.
     */
    export class Collection<T> implements CollectionProviderInterface<T> {

        protected items: Array<T>;
        protected scope: any;

        public constructor(items: Array<T> = [], scope: any = null) {
            var me = this;
            me.items = [];
            items.forEach(function (itm: T) {
                me.items.push(itm);
            });
            me.scope = scope;
        }

        public getItems(): Array<T> {
            var me = this,
                result: Array<T> = [];
            me.items.forEach(function (itm: T) {
                result.push(itm);
            });
            return result;
        }

        public countItems(): number {
            return this.items.length;
        }

        public itemAtIndex(index: number): T {
            return this.items[index] || null;
        }

        public indexOf(item: T): number {
            var me = this,
                index: number = -1;
            me.forEach(function (itm: T, idx: number) {
                if (item === itm) {
                    index = idx;
                    return false;
                }
            });
            return index;
        }

        public remove(itemOrIndex: T | number): void {
            var me = this,
                index: number;
            if (!Blend.isNumeric(itemOrIndex)) {
                index = me.indexOf(<T>itemOrIndex);
            } else {
                index = <number>itemOrIndex;
            }
            if (index >= 0) {
                me.items.splice(index, 1);
            }
        }

        public insertAt(index: number, item: T): void {
            var me = this,
                items = me.items;
            me.items = [];
            me.add(item);
            items.splice(index, 0, me.items[0]);
            me.items = items;
        }

        public forEach(callback: (item: T, index?: number) => void): void {
            var me = this;
            Blend.forEach(me.items, callback, me.scope || me);
        }

        public add(item: T | Array<T>): void {
            var me = this;
            Blend.wrapInArray(item).forEach(function (itm: T) {
                me.items.push(itm);
            });
        }

        public clearItems(callback?: (item: T, index?: number) => void) {
            var me = this;
            if (callback) {
                me.forEach(callback);
            }
            me.items = [];
        }
    }

}