namespace Blend.dom {
    /**
     * Implements a classList provider for the Blend.dom.Element
     */
    export class ClassList {

        protected list: Array<string>;

        public constructor(htmlElement: HTMLElement) {
            var me = this;
            me.list = [];
            me.initList((htmlElement.getAttribute('class') || '').trim());
        }

        private initList(css: string) {
            var me = this;
            (css === "" ? [] : css.split(' ')).forEach(function(c: string) {
                c = c.trim();
                if (c.length !== 0 && c !== '') {
                    me.list.push(c);
                }
            });
        }

        public serializeTo(htmlElement: HTMLElement) {
            var me = this,
                css = me.toString();
            if (css !== null && css !== "" && css.length !== 0) {
                htmlElement.setAttribute('class', css);
            } else {
                htmlElement.removeAttribute('class');
            }
        }

        public remove(list: Array<string>) {
            var me = this, i = -1;
            list.forEach(function(r: string) {
                i = me.list.indexOf(r);
                if (i !== -1) {
                    me.list.splice(i, 1);
                }
            });
        }

        public add(list: Array<string>) {
            var me = this;
            list.forEach(function(i: string) {
                if (!me.has(i)) {
                    me.list.push(i);
                }
            })
        }

        public clear() {
            this.list = [];
        }

        public has(n: string) {
            return this.list.indexOf(n) !== -1;
        }

        public toString(): string {
            var r = this.list.join(' ').trim();
            return r === "" ? null : r;
        }

        public toArray(): Array<string> {
            return this.list;
        }
    }
}