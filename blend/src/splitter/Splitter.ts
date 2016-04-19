/// <reference path="../common/Interfaces.ts" />
/// <reference path="../Blend.ts" />
/// <reference path="../dom/Element.ts" />
/// <reference path="../ui/View.ts" />

namespace Blend.splitter {

    export class Splitter extends Blend.ui.View {

        protected splitType: string;
        protected activeCssClass: string;
        protected hoverCssClass: string;
        protected cursorCssClass: string;
        protected isActive: boolean;
        protected ghostEl: Blend.dom.Element;

        protected positionProperty: string;
        protected sizeProperty: string;
        protected movementProperty: string;

        protected currentDisplacement: number;
        protected origin: ElementBoundsInterface;
        protected curPosition: ElementBoundsInterface;

        protected beforeView: Blend.ui.View;
        protected afterView: Blend.ui.View;

        protected beforeBounds: ElementBoundsInterface;
        protected afterBounds: ElementBoundsInterface;

        protected beforeSizeLimit: number;
        protected afterSizeLimit: number;

        protected moveHandlerFn: EventListener;


        /**
         * Calculate the limita in which this splitter can move
         */
        private prepareMovementLimits() {
            var me = this,
                minProperty = 'min' + me.sizeProperty.ucfirst();

            me.beforeBounds = me.beforeView.getBounds();
            me.afterBounds = me.afterView.getBounds();

            me.beforeSizeLimit = me.beforeView.getProperty<number>(minProperty, 0) || 0;
            me.afterSizeLimit = me.afterView.getProperty<number>(minProperty, 0) || 0;
        }

        public constructor(config: SplitterInterface = {}) {
            super(config);
            var me = this;
            me.cssClass = 'splitter';
            me.activeCssClass = cssPrefix('splitter-active');
            me.hoverCssClass = cssPrefix('splitter-hover');
            me.isActive = false;
            me.ghostEl = null;
            me.setBounds({ width: 9, height: 9 });
        }

        protected initialize() {
            var me = this;
            if (me.parent && Blend.isInstanceOf(me.parent, Blend.container.Box)) {
                me.splitType = eBoxType[me.parent.getProperty<number>('boxType', eBoxType.hbox)];
                me.cursorCssClass = cssPrefix('splitter-' + me.splitType + '-cursor')
                me.addCssClass('splitter-' + me.splitType, true);
                if (me.splitType === 'hbox') {
                    me.positionProperty = 'left';
                    me.sizeProperty = 'width';
                    me.movementProperty = 'screenX';
                } else {
                    me.positionProperty = 'top';
                    me.sizeProperty = 'height';
                    me.movementProperty = 'screenY';
                }
            } else {
                throw new Error('A Blend.splitter.Splitter View must be places inside a Box container to work!')
            }
        }


        /**
         * Creates a hover effect for when the mouse is hovering over this splitter
         */
        private initHoverEffect() {
            var me = this;
            me.element.addEventListener('mouseenter', function() {
                me.element.addCssClass(me.hoverCssClass, false);
            });
            me.element.addEventListener('mouseleave', function() {
                me.element.removeCssClass(me.hoverCssClass, false);
            });
        }

        /**
         * Create a ghost element that will act as a visual cue
         */
        private createGhost() {
            var me = this;
            me.ghostEl = wrapEl(<HTMLElement>me.element.getEl().cloneNode(true));
            me.ghostEl.addCssClass('splitter-ghost', true);
            me.element.getEl().parentElement.appendChild(me.ghostEl.getEl());
        }

        /**
         * Position the ghost element on top of this splitter
         */
        private positionGhost() {
            var me = this;
            if (!me.ghostEl) {
                me.createGhost();
            }
            var bounds = me.getBounds();
            me.ghostEl.setStyle({
                display: 'block',
                left: bounds.left,
                top: bounds.top
            })
            me.curPosition = bounds;
        }

        /**
         * Move the ghost element and enforce the minimal View sizes
         */
        private handleMovement(ev: MouseEvent) {
            var me = this,
                move: boolean = false,
                movementPosition = (<any>ev)[me.movementProperty],
                newSize: number,
                displacement = movementPosition - (<any>me.origin)[me.positionProperty]

            if (displacement < 0) {
                // towards before View
                move = ((<any>me.beforeBounds)[me.sizeProperty] - Math.abs(displacement)) > me.beforeSizeLimit;
            } else if (displacement > 0) {
                // towards after View
                move = ((<any>me.afterBounds)[me.sizeProperty] - Math.abs(displacement)) > me.afterSizeLimit;
            }

            if (move) {
                me.currentDisplacement = displacement;
                setTimeout(function() {
                    me.ghostEl.setStyle({
                        [me.positionProperty]: (<any>me.curPosition)[me.positionProperty] + displacement
                    });
                }, 2);
            }
        }

        /**
         * Kicks in the splitter movement
         */
        private activate(ev: MouseEvent) {
            var me = this;
            if (!me.isActive) {
                me.currentDisplacement = 0;
                me.isActive = true;
                me.origin = { top: ev.screenY, left: ev.screenX };
                me.element.addCssClass([me.activeCssClass, me.cursorCssClass], false);
                me.element.removeCssClass(me.hoverCssClass, false);
                me.positionGhost();
                me.prepareMovementLimits();
                me.moveHandlerFn = function(ev: MouseEvent) {
                    me.handleMovement.apply(me, arguments);
                }
                Blend.Runtime.addEventListener(document, 'mousemove', me.moveHandlerFn);
            }
        }

        /**
         * Resizes the before and the after View by changes the View sizes
         */
        private resizeViews() {
            var me = this,
                reszie = Math.abs(me.currentDisplacement),
                beforeSize: number,
                afterSize: number;
            if (me.currentDisplacement !== 0) {
                me.beforeView.suspendLayout().disableEvents();
                me.afterView.suspendLayout().disableEvents();
                if (me.currentDisplacement > 0) {
                    beforeSize = (<any>me.beforeBounds)[me.sizeProperty] + reszie;
                    afterSize = (<any>me.afterBounds)[me.sizeProperty] - reszie;
                } else {
                    beforeSize = (<any>me.beforeBounds)[me.sizeProperty] - reszie;
                    afterSize = (<any>me.afterBounds)[me.sizeProperty] + reszie;
                }

                me.beforeView.setBounds({ [me.sizeProperty]: beforeSize });
                me.afterView.setBounds({ [me.sizeProperty]: afterSize });
                me.adjustFlexValue(me.beforeView, beforeSize);
                me.adjustFlexValue(me.afterView, afterSize);
                me.beforeView.resumeLayout().enableEvents();
                me.afterView.resumeLayout().enableEvents();
            }
        }

        /**
         * Bind Views before and after this splitter so we can process them later
         */
        public bindAdjacentViews(beforeView: Blend.ui.View, afterView: Blend.ui.View) {
            var me = this;
            me.beforeView = beforeView;
            me.afterView = afterView;
        }


        /**
         * Recalculate the View flexed sized if possible
         */
        private adjustFlexValue(view: Blend.ui.View, size: number) {
            var me = this,
                flex = view.getProperty<number>('flex', null),
                flexPerPixel: number;
            if (flex !== null) {
                view.setProperty('flex', view.getProperty<number>('flexPerPixel') * size);
            }
        }

        /**
         * Finished the splitter movement
         */
        private deActivate(ev: MouseEvent) {
            var me = this;
            if (me.isActive) {
                me.isActive = false;
                me.element.removeCssClass([me.activeCssClass, me.cursorCssClass, me.hoverCssClass], false);
                me.resizeViews();
                Blend.Runtime.removeEventListener(document, 'mousemove', me.moveHandlerFn);
                me.ghostEl.setStyle({ display: 'none' });
                (<Blend.ui.View>me.parent).invalidateLayout(true);  // force to perform layout
            }
        }

        protected finalizeRender() {
            var me = this;
            super.finalizeRender();
            me.initHoverEffect();

            me.element.addEventListener('mousedown', function(ev: MouseEvent) {
                me.activate.apply(me, arguments);
            });
            Blend.Runtime.addEventListener(document, 'mouseup', function(ev: MouseEvent) {
                me.deActivate.apply(me, arguments);
            })
        }
    }
}

namespace Blend {
    registerClassWithAlias('ui.splitter', Blend.splitter.Splitter);
}