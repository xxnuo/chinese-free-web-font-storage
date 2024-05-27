import { DebounceAtom,  atom, reflect } from '@cn-ui/reactive';
import { VModel } from '../utils/VModel';
export const CDNHome = () => {
    const selected = atom<LinkTemplate>({
        version: 'chinese3',
        package: 'jxzk',
        subPackage: '江西拙楷',
    });
    return (
        <section class="m-auto w-full max-w-5xl p-8 text-center">
            <div class=" py-8">
                <h1 class="my-12  py-8 text-8xl">字图 CDN</h1>
                <p class="mb-8  text-left text-xl text-gray-500">
                    字图 CDN, 一个免费的中文字体公益 CDN 服务, 致力于为国内外全球 CJK
                    开发者提供高质量网络字体服务，让中文字体在互联网世界起飞。
                </p>
                <p class="flex justify-around rounded-md bg-blue-400 text-xl text-gray-50">
                    <span>稳定</span>
                    <span>快速</span>
                    <span>免费</span>
                </p>
            </div>
            <SearchBox />
            {/* <CDNLink {...selected()} /> */}
        </section>
    );
};
import data from '../../index.json';
import { __CDN__ } from '../global';
import { Show } from 'solid-js';
import copy from 'copy-to-clipboard';
import { Notice } from '../Notice';
const SearchBox = () => {
    const search = atom('');
    const items = DebounceAtom(
        reflect(() =>
            Object.entries(data)
                .flatMap(([key, val]) => {
                    return {
                        name: val.name,
                        fonts: val.remotePath.map((remote) => {
                            const [_, name] = remote.match(/dist\/(.*?)\/result/)!;
                            const pic = remote.replace('result.css', 'preview.svg');
                            return {
                                url: `https://chinese-font.netlify.app/fonts/${key}/${name}`,
                                cdn: remote,
                                name: val.name,
                                subName: name,
                                pic,
                            };
                        }),
                    };
                })
                .reverse()
                .filter((i) => {
                    if (!search()) return true;
                    return i.name.includes(search());
                })
        )
    );
    return (
        <>
            <div class="flex items-center rounded-md bg-white px-4 py-4 text-gray-600 transition-shadow hover:shadow-md">
                <i class="mr-2 h-5 w-5">
                    <svg
                        viewBox="64 64 896 896"
                        data-icon="search"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0011.6 0l43.6-43.5a8.2 8.2 0 000-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z" />
                    </svg>
                </i>
                <input
                    type="text"
                    class="flex-1 appearance-none outline-none"
                    {...VModel(search)}
                    placeholder="试着搜索你想要的字体"
                />
                <Show when={items().length}>
                    <span class="flex-none text-xs text-gray-400">
                        为你找到 {items().length} 份字体
                    </span>
                </Show>
            </div>
           
            <ul class="grid grid-cols-1 gap-4 py-8  sm:grid-cols-2  md:grid-cols-3">
                {items().map((i) => {
                    return i.fonts.map((font) => {
                        return (
                            // biome-ignore lint/correctness/useJsxKeyInIterable: <explanation>
                            <li class="z-0 flex flex-col justify-between rounded border bg-gray-100 p-2 transition-all hover:z-10 hover:scale-150 hover:text-green-600 hover:shadow-md hover:backdrop-blur-sm">
                                <span class="mb-2 border-b pb-2 text-2xl">{font.name}</span>
                                <img loading="lazy" src={`${__CDN__}/${font.pic}`} alt="" />
                                <span
                                    title={`https://chinese-fonts-cdn.deno.dev/chinese3/${font.cdn}`}
                                    class="flex justify-evenly border-t pt-1 text-xs text-gray-600"
                                >
                                    <span>{font.subName}</span>
                                    <span>·</span>
                                    <span
                                        class="cursor-pointer transition-colors hover:text-green-600"
                                        onclick={() => {
                                            copy(
                                                `https://chinese-fonts-cdn.deno.dev/chinesefonts3/${font.cdn}`
                                            );
                                            Notice.success('复制 CDN 地址成功');
                                        }}
                                    >
                                        复制 CSS 地址
                                    </span>
                                    <span>·</span>
                                    <a
                                        href={font.url}
                                        class="cursor-pointer transition-colors hover:text-green-600"
                                    >
                                        详情
                                    </a>
                                </span>
                            </li>
                        );
                    });
                })}
            </ul>
        </>
    );
};

interface LinkTemplate {
    version: string;
    package: string;
    subPackage: string;
}

const CDNLink = (props: LinkTemplate) => {
    return (
        <div class="flex w-fit">
            <p class=" text-lg font-bold text-green-600">
                https://chinese-fonts-cdn.deno.dev/
                <span class="cursor-pointer border-b-4 border-dashed border-orange-700">
                    {props.version}
                </span>
                /packages/
                <span class="cursor-pointer border-b-4 border-dashed border-orange-700">
                    {props.package}
                </span>
                /dist/
                <span class="cursor-pointer border-b-4 border-dashed border-orange-700">
                    {props.subPackage}
                </span>
                /result.css
            </p>
        </div>
    );
};
