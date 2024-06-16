import { atom } from '@cn-ui/reactive';
import { Notice } from '../../Notice';
import { RaceFetch } from './RaceFetch';

export const PluginVersion = atom('');
// 转为异步加载，防止文件发生阻塞
let roots = [
    'https://jsdelivr.deno.dev/npm/cn-font-split',
    // 'https://cdn.jsdelivr.net/npm/cn-font-split',
];
export const preload = () => {
    /** 24h 小时更新一次的链接，保证版本更新正确 */
    const scriptLink =
        roots[0] +
        (PluginVersion() ? '@' + PluginVersion() : '') +
        '/dist/browser/index.js?t=' +
        (Date.now() / (24 * 60 * 60 * 1000)).toFixed(0);
    return import(/* @vite-ignore */ scriptLink)
        .then((res) => {
            const { fontSplit, Assets } = res as Awaited<typeof import('cn-font-split')>;
            // 注册在线地址
            Assets.pathTransform = (innerPath: string) =>
                innerPath.replace('./', roots[0] + '/dist/browser/');
            // 获取版本号信息
            fetch(scriptLink, { cache: 'force-cache' }).then((res) => {
                PluginVersion(res.headers.get('X-Jsd-Version')!);
            });
            return fontSplit;
        })
        .catch((e) => {
            console.error(e);
            Notice.error(e as Error);
        });
};
// 为给用户提供良好的体验，直接开始下载需要的依赖包
Promise.all([
    RaceFetch('/dist/browser/hb-subset.wasm', { priority: 'low' }, roots),
    RaceFetch('/dist/browser/cn_char_rank.dat', { priority: 'low' }, roots),
    RaceFetch('/dist/browser/unicodes_contours.dat', { priority: 'low' }, roots),
    RaceFetch('/dist/browser/compress_binding.wasm', { priority: 'low' }, roots),
]).then((res) => console.log('资源预加载完成'));
/** 获取 cn-font-split 的版本号 */
export const getVersions = () => {
    return fetch('https://data.jsdelivr.com/v1/package/npm/cn-font-split')
        .then((res) => res.json())
        .then((res) => res.versions.slice(0, 10) as string[]);
};
/** 加载测试文件 */
export const getTestingFile = () => {
    return fetch(
        'https://jsdelivr.deno.dev/gh/KonghaYao/cn-font-split/packages/demo/public/SmileySans-Oblique.ttf'
    )
        .then((res) => res.blob())
        .then((res) => new File([res], 'SmileySans-Oblique.ttf'));
};
