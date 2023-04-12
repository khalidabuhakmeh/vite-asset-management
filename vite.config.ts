import {defineConfig} from "vite";
import {processAssetFileNames, entryFileNames, chunkFileNames, assetDir} from "./config/assets";
import {resolve} from "path";
import viteHtmlResolveAlias from 'vite-plugin-html-resolve-alias'

export default defineConfig({

    resolve: {
        alias: {
            '@img': resolve(__dirname, 'src/img/'),
            '@rss': resolve(__dirname, 'src/rss.xml')
        }
    },

    plugins: [
      viteHtmlResolveAlias()
    ],

    build: {
        minify: true,
        assetsDir: assetDir,
        // don't inline anything for demo
        assetsInlineLimit: 0,
        emptyOutDir: true,
        rollupOptions: {
            output: {
                entryFileNames: entryFileNames,
                assetFileNames: processAssetFileNames,
                chunkFileNames: chunkFileNames
            }
        }
    }
});

