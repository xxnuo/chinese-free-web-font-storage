import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import solidJs from '@astrojs/solid-js';
import tailwind from '@astrojs/tailwind';
import robotsTxt from 'astro-robots-txt';
import compress from 'astro-compress';
import { viteStaticCopy } from 'vite-plugin-static-copy';
// import astroRemark from '@astrojs/markdown-remark';
import { loadEnv } from 'vite';
const env = loadEnv(import.meta.env.MODE, process.cwd(), '');
// https://astro.build/config
export default defineConfig({
    site: 'https://chinese-font.netlify.app',

    integrations: [sitemap(), solidJs(), tailwind(), robotsTxt(), compress()],
    // output: 'server',
    output: 'static',
    vite: {
        optimizeDeps: {
            exclude: ['cn-font-split'],
        },
        build: { sourcemap: true },
        plugins: [
            viteStaticCopy({
                targets: [
                    {
                        src: 'assets',
                        dest: '',
                    },
                ],
            }),
        ],
    },
    markdown: {
        shikiConfig: {
            // Choose from Shiki's built-in themes (or add your own)
            // https://github.com/shikijs/shiki/blob/main/docs/themes.md
            theme: 'vitesse-light',
            // Enable word wrap to prevent horizontal scrolling
            wrap: true,
        },
        render: [
            // astroRemark,
            {
                rehypePlugins: [
                    'rehype-slug',
                    ['rehype-autolink-headings', { behavior: 'append' }],
                    ['rehype-toc', { headings: ['h1', 'h2'] }],
                ],
            },
        ],
    },
});
