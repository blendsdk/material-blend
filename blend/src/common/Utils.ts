interface Array<T> {
    unique(): Array<T>;
}

interface String {
    ucfirst(): string;
}

interface Function {
    async: any;
}

if (!Function.prototype.async) {
    Function.prototype.async = function() {
        var me = this,args = arguments;
        setTimeout(function() {
            me.apply(me, args);
        }, 1);
    };
}

if (!String.prototype.ucfirst) {
    String.prototype.ucfirst = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };
}

if (!String.prototype.trim) {
    String.prototype.trim = function() {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };
}

if (!(<any>Array.prototype).unique) {
    (<any>Array.prototype).unique = function() {
        return this.filter(function(item: any, i: any, allItems: any) {
            return i == allItems.indexOf(item);
        });
    }
}