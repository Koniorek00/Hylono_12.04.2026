// Ambient type declaration for vite-plugin-compression
// Fixes: Could not find a declaration file for module 'vite-plugin-compression'
declare module 'vite-plugin-compression' {
    import { Plugin } from 'vite';

    interface ViteCompressionOptions {
        /** Compression algorithm. Default: 'gzip' */
        algorithm?: 'gzip' | 'brotliCompress' | 'deflate' | 'deflateRaw';
        /** File extension for compressed files. Default: '.gz' */
        ext?: string;
        /** Minimum file size in bytes to compress. Default: 1025 */
        threshold?: number;
        /** Whether to delete the original file after compression. Default: false */
        deleteOriginFile?: boolean;
        /** Filter files to compress (glob pattern or RegExp). Default: /\.(js|mjs|json|css|html)$/i */
        filter?: RegExp | ((file: string) => boolean);
        /** Whether to enable verbose logging. Default: false */
        verbose?: boolean;
        /** Whether to disable compression. Default: false */
        disable?: boolean;
    }

    function viteCompression(options?: ViteCompressionOptions): Plugin;
    export default viteCompression;
}
