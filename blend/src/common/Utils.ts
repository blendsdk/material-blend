interface Array<T> {
    unique(): Array<T>;
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