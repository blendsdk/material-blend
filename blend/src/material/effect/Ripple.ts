/**
 * This class is an adaptaion and ported from "Material Design Lite"
 */

/// <reference path="../../common/Interfaces.ts" />
/// <reference path="../../Blend.ts" />
/// <reference path="../../Component.ts" />
/// <reference path="../../dom/Element.ts" />

interface RippleInterface extends DictionaryInterface {
    element?: Blend.dom.Element,
    center?: boolean,
    color?: string
}

namespace Blend.material.effect {

    export class Ripple extends Component {

        private element: Blend.dom.Element;
        private container: Blend.dom.Element;
        private currentRipple: Blend.dom.Element;
        private isHandling: boolean;
        private skipMouseEvent: boolean;
        private center: boolean;
        private rippleDuration: number;
        private removeQueue: Array<Blend.dom.Element>;
        protected color: string;

        public constructor(config: RippleInterface = {}) {
            super(config);
            var me = this;
            me.removeQueue = [];
            me.isHandling = false;
            me.rippleDuration = 400;
            me.skipMouseEvent = false;
            me.center = config.center === true ? true : false;
            me.element = config.element || null;
            if (me.element !== null) {
                me.bindEvents();
                me.color = me.initRippleColor(config.color || null)
            }
        }

        protected bindEvents() {
            var me = this;
            if (me.element.getProperty('hasRipple', false) === false) {
                me.element.addEventListener('mousedown', Blend.bind(me, me.handleDownEvent));
                me.element.addEventListener('mouseup', Blend.bind(me, me.handleHandleUpEvent));
                me.element.setProperty('hasRipple', true);
                me.createRippleContainer();
            }
        }

        protected createRippleContainer() {
            var me = this,
                copyStyles = me.element.getStyle(['border-radius', 'border-color', 'border-width', 'border-style']);
            me.container = me.element.append(Blend.createElement({
                cls: 'mb-ripple-container',
                style: copyStyles
            }));
        }

        protected handleDownEvent(evt: Event) {
            var me = this, top: number, left: number, mouseEvent: MouseEvent
            if (!me.isHandling) {
                //me.isHandling = true;
                if (me.center === true) {
                    left = me.container.getEl().clientWidth / 2;
                    top = me.container.getEl().clientHeight / 2;
                } else {
                    mouseEvent = <MouseEvent>evt;
                    if (mouseEvent.srcElement != me.container.getEl()) {
                        var crect = me.container.getEl().getBoundingClientRect();
                        left = mouseEvent.clientX - crect.left;
                        top = mouseEvent.clientY - crect.top;
                    } else {
                        left = (<MouseEvent>evt).offsetX;
                        top = (<MouseEvent>evt).offsetY;
                    }
                }
                me.initiateRipple(left, top)
            }
        }

        protected handleHandleUpEvent() {
            var me = this;
            while (me.removeQueue.length !== 0) {
                var ripple = me.removeQueue.splice(0, 1)[0];
                setTimeout(function() {
                    ripple.removeCssClass(['mb-ripple-active']);
                    setTimeout(function() {
                        ripple.getEl().parentNode.removeChild(ripple.getEl());
                    }, 2000);
                }, me.rippleDuration * 0.4);
            }
        }

        protected initiateRipple(left: number, top: number) {
            var me = this,
                ripple = me.container.append(Blend.createElement({
                    cls: ['mb-ripple'],
                    style: {
                        top: top,
                        left:left
                    }
                })),
                width = me.element.getEl().clientWidth,
                height = me.element.getEl().clientHeight,
                x = Math.max(Math.abs(width - left), left) * 2,
                y = Math.max(Math.abs(height - top), top) * 2,
                size = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            me.color = me.initRippleColor('.mb-btn-icon');
            ripple.setStyle({
                width: size,
                height: size,
                'background-color': me.color,
            });
            ripple.addCssClass(['mb-ripple-placed']);
            setTimeout(function() {
                ripple.addCssClass(['mb-ripple-scaled']);
                ripple.addCssClass(['mb-ripple-active']);
            }, 5);
            me.removeQueue.push(ripple);
        }

        /**
         * Converts a hex color to a RGB format
         */
        private hexToRgb(value: string): string {
            if (Blend.isString(value) && value.length !== 0 && value[0] === '#') {
                if (value.length === 4) {
                    var t = value.split('');
                    value = '#' + t[1] + t[1] + t[2] + t[2] + t[3] + t[3]
                }
                if (value.length === 7) {
                    var p = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(value);
                    return p ? `rgba(${parseInt(p[1], 16)},${parseInt(p[2], 16)},${parseInt(p[3], 16)})` : null;
                }
            }
            return value;
        }

        /**
         * Initializes the ripple color by pasring it to either the provided RGBA format or the
         * default black color if the color code cannot be parsed. If the name of the color is
         * a CSS selector then it looks for the color of the element found by the selector.
         */
        protected initRippleColor(color: string): string {
            var me = this,
                opacity: number = 0.95,
                prop = 'color',
                defaultColor = 'rgb(0,0,0)';
            var colorElement = Blend.selectElement(color, me.element);
            if (colorElement) {
                color = <string>colorElement.getStyle(prop)[prop];
            } else {
                color = me.hexToRgb(color || defaultColor);
            }
            var t = color.replace(/\brgba\b|\brgb\b|\s|\(|\)/g, '').split(',');
            if (t.length >= 3) {
                return `rgba(${t[0]},${t[1]},${t[2]},${opacity})`;
            } else {
                return `rgba(0,0,0,${opacity})`;
            }
        }
    }

}
