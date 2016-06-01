declare module 'version-comparison' {

    export function vercompare(a: string, b: string): number;
}

declare module 'fs-extra' {

    export function copySync(source: string, dest: string): void;

}

declare module 'del' {
    export function sync(folder: string, options: any): void
}

declare module 'uglify-js' {

}