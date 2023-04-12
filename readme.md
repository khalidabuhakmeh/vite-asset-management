# Vite Asset Management

This repository shows how you can manage where assets are stored when you execute Vite's `build` command.

Typically, assets are dropped into the `/assets` folder and if you don't care about it, then change nothing. Why are you still reading this?!

If you do care about how your assets are processed, then take a look at `./config/assets.ts`, where I create a one-stop shop for managing assets.

```typescript
import {PreRenderedAsset} from "rollup";

type AssetOutputEntry = {
    output: string,
    regex: RegExp
}

export const assetDir = "assets";
export const entryFileNames = `${assetDir}/js/[name]-[hash].js`;
export const chunkFileNames = `${assetDir}/js/[name]-[hash]-chunk.js`
const assets: AssetOutputEntry[] = [
    {
        output: `${assetDir}/img/[name]-[hash][extname]`,
        regex: /\.(png|jpe?g|gif|svg|webp|avif)$/
    },
    {
        regex: /\.css$/,
        output: `${assetDir}/css/[name]-[hash][extname]`
    },
    {
        output: `${assetDir}/js/[name]-[hash][extname]`,
        regex: /\.js$/
    },
    {
        output: `[name][extname]`,
        regex: /\.xml$/
    }
];

export function processAssetFileNames(info: PreRenderedAsset): string {
    if (info && info.name) {
        const name = info.name as string;
        const result = assets.find(a => a.regex.test(name));
        if (result) {
            return result.output;
        }
    }
    // default since we don't have an entry
    return `${assetDir}/[name]-[hash][extname]`
}
```

Additionally, some files you may want to keep with the `[hash]` added on and some files you don't. The magic happens in the `processAssetFileNames` method. As files are processed through Vite's build pipeline, we find the matching rule and get the appropriate name. If no name is found, then we return the default template name.

## HTML Resolve Alias

There are some assets that you will want to use in HTML and in JavaScript files. In this sample, I'm using `vite.svg` in the `main.ts` file as well as in `index.html`.

**Note: The following package says it's incompatible with the latest Vite version, but it's really not. So you may need to perform an `npm install --force` to get the package installed.**

Using the package `vite-plugin-html-resolve-alias`, I can create resolution aliases that the plugin will process in my HTML files. Let's see what setting up aliases looks like.

```javascript
resolve: {
    alias: {
        '@img': resolve(__dirname, 'src/img/'),
        '@rss': resolve(__dirname, 'src/rss.xml')
    }
},
```

The `resolve` option in Vite is standard and lets you shorthand otherwise long and complex paths to assets. The plugin expands the capability to HTML files, including tags like `script`, `link`, `img`, and `video`. This helps eliminate the gymnastics that might come with deciding whether to put assets in `public` or in the `src` directory.

Since assets are now going through the Vite build pipeline, you can use other Vite plugins to process the files.You can perform additional tasks such as image minification. It's a win-win!

Here's how to resolve assets in your `index.html` file or other HTML files in your web application.

```html
<link rel="icon" type="image/svg+xml" href="@img/vite.svg"/>
<link rel="alternate" type="application/rss+xml" title="RSS Feed" href="@rss"/>
```

Notice how each value the symbols matches what we defined in our Vite configurations.

This is a neat little demo project that shows what Vite is capable of doing with a little bit of thought put into the configuration. I hope you found it helpful. Cheers :)

