import { For, Show, createEffect } from 'solid-js';
import { DragDropButton } from '../DragButton';
import {
    ArrayAtom,
    atom,
    classHelper,
    resource,
} from '@cn-ui/reactive';
import prettyBytes from 'pretty-bytes';
import { Notice } from '../../Notice';

export const OnlineSplit = () => {
    const file = atom<File | null>(null);
    const logMessage = ArrayAtom<string[]>([]);
    const resultList = atom<{ name: string; buffer: Uint8Array }[]>([]);
    const versions = resource(getVersions, { initValue: [] });
    /** 监控 cn-font-split 的加载状态并给予提示 */
    const fontSplitStatus = resource(preload);

    createEffect(() => {
        fontSplitStatus() &&
            logMessage((i) => [...i, `cn-font-split ${PluginVersion()} 准备完毕 `]);
    });

    /** 监控 zip 压缩 */
    const createZip = useZip(() => {
        if (!file()) throw new Error('请添加文件');
        return file()!.name.replace(/\..*/, '');
    }, resultList);
    /** 启动字体分包进程 */
    const startSplit = resource(
        async () => {
            const cnFontSplit = fontSplitStatus();
            if (!file()) throw new Error('请添加文件');
            if (!cnFontSplit) throw new Error('请等待 cn-font-split 加载完成');
            logMessage([]);
            resultList([]);
            const arrayBuffer = await file()!.arrayBuffer()
            return cnFontSplit({
                destFold: '',
                FontPath: new Uint8Array(arrayBuffer),
                previewImage: {},
                log(...args) {
                    logMessage((i) => [...i, args.join(' ')]);
                },
                // 生产的文件转存另一个分包
                async outputFile(path, file) {
                    const buffer =
                        file instanceof Uint8Array
                            ? file
                            : new Uint8Array(await new Blob([file]).arrayBuffer());
                    resultList((i) => [...i, { name: path, buffer }]);
                },
            })
                .then((res) => {
                    Notice.success('全部打包任务完成');
                    return res;
                });
        },
        {
            immediately: false
        }
    );
    return (
        <section class={classHelper.base("mx-auto my-8 grid aspect-video h-[80vh] w-full max-w-[96rem] grid-cols-2 gap-4 overflow-hidden rounded-xl bg-white transition-all border-2")(

            startSplit.loading() && "border-yellow-500 ",
            startSplit.error() && "border-red-600",
            "border-gray-200"

        )}>
            <div class="flex flex-col p-4">
                <header class="flex items-center gap-8">
                    <label class="flex-none">版本号</label>
                    <select
                        oninput={(e) => {
                            PluginVersion(e.target.value);
                            fontSplitStatus.refetch();
                            Notice.success('正在更换版本中，请稍等');
                        }}
                    >
                        {versions().map((version) => {
                            return <option value={version}>{version}</option>;
                        })}
                    </select>
                    <button
                        class="w-full cursor-pointer transition-colors hover:bg-neutral-200"
                        onclick={() => {
                            getTestingFile().then((f) => file(() => f));
                        }}
                    >
                        尝试使用测试字体文件
                    </button>
                </header>
                <Show
                    when={file()}
                    fallback={
                        <DragDropButton
                            class="text-gray-600"
                            accept=".ttf,.otf,.woff2"
                            onGetFile={(f) => {
                                file(() => f);
                                logMessage((i) => [...i, '请点击开始按钮']);
                            }}
                        >
                            <header class="pb-2 text-xl text-black">
                                在线字体分包器 <br></br>
                                <aside class='text-md text-gray-400 py-4'>
                                    .otf .ttf  ====》  .css + .woff2
                                </aside>
                                <aside class="flex justify-center gap-4 py-4">
                                    <span class="rounded-md bg-green-600 px-2 text-sm text-white">
                                        cn-font-split v{PluginVersion()}
                                    </span>
                                    <a href="https://github.com/KonghaYao/cn-font-split">
                                        <img
                                            src="https://data.jsdelivr.com/v1/package/npm/@konghayao/cn-font-split/badge"
                                            alt="JSDeliver Badge"
                                        />
                                    </a>
                                </aside>
                            </header>
                        </DragDropButton>
                    }
                >
                    <div class="flex h-full flex-col items-center justify-center gap-4">
                        <h2 class="pb-2 text-xl">在线字体分包器 {PluginVersion()}</h2>
                        <div>
                            {file()!.name} | {prettyBytes(file()!.size)}
                        </div>
                        <div class='flex gap-2'>
                            <Show
                                when={startSplit.isReady()}
                                fallback={
                                    <div class="text-red-600 ">
                                        正在处理文件中，请稍等，这个文本消失之后即为完成
                                    </div>
                                }
                            >
                                <button
                                    onclick={() => startSplit.refetch()}
                                    class="rounded-lg bg-green-600 p-1 text-white"
                                >
                                    点击开始进行字体分包
                                </button>
                                <button
                                    onclick={() => file(null)}
                                    class="rounded-lg bg-yellow-500 p-1 text-white"
                                >
                                    更换字体
                                </button>
                            </Show>
                        </div>
                    </div>
                </Show>
                <div class="px-4 text-xs text-rose-600">
                    <Show when={fontSplitStatus.isReady()}>
                        <a href="https://github.com/KonghaYao/cn-font-split">
                            在线分包由于特殊原因不支持某些特性，如需支持可使用代码分包➡️。
                        </a>
                    </Show>
                    <Show when={fontSplitStatus.error()}>
                        加载 cn-font-split 失败：{fontSplitStatus.error().message}
                        <br />
                        可能是您的浏览器版本过低，试试更新版本的浏览器吧
                    </Show>
                    <Show when={fontSplitStatus.loading()}>加载 cn-font-split 中</Show>
                </div>
            </div>

            <section class="flex h-full flex-col gap-4 overflow-hidden bg-gray-200 p-4">
                <header class="flex justify-between ">
                    <span class="text-xl">Logger 日志</span>
                    <div class='flex-1'></div>
                    <a href="https://github.com/KonghaYao/cn-font-split/issues" target="_blank">
                        反馈
                    </a>
                    <a href="https://github.com/KonghaYao/cn-font-split" target="_blank">
                        Github
                    </a>
                </header>
                <Show when={startSplit.error()}>
                    <div class="text-red-600">
                        发生错误：{startSplit.error().message}{' '}
                        <button onclick={() => startSplit.refetch()}>点击此处刷新</button>
                    </div>
                </Show>
                <LogMessage logMessage={logMessage()}></LogMessage>
                <header class="text-xl">Output 输出文件</header>
                <section class='flex h-full  max-h-[100%] overflow-hidden bg-gray-800 font-sans text-sm text-gray-100 rounded-xl select-text '>

                    <FileList resultList={resultList()}></FileList>
                    <Show when={startSplit()}>
                        <div class='flex flex-col rounded-xl bg-gray-700 p-2'>
                            <span>
                                字体名称：
                                {
                                    startSplit().css.family
                                }
                            </span>
                            <span>
                                字重：
                                {
                                    startSplit().css.weight
                                }
                            </span>
                        </div>
                    </Show>
                </section>
                <span class="flex justify-end gap-4 text-xs text-green-600">
                    <span> 在您的代码里面直接引用 result.css 文件就好啦</span>
                    <div class='flex-1'></div>
                    <span>{resultList().length}</span>
                    <span>
                        {prettyBytes(resultList().reduce((col, i) => i.buffer.byteLength + col, 0))}
                    </span>

                    <button
                        class="rounded-lg bg-green-600 p-1 text-center  text-gray-100"
                        onclick={() => createZip.refetch()}
                    >
                        压缩下载 zip
                    </button>
                </span>
            </section>
        </section>
    );
};
import { createAutoAnimate } from '@formkit/auto-animate/solid';
import { useZip } from './useZip';
import { getVersions, preload, PluginVersion, getTestingFile } from './getVersions';

/** 右下角的文件列表 */
function FileList(props: {
    resultList: {
        name: string;
        buffer: Uint8Array;
    }[];
}) {
    return (
        <ul class="flex h-full flex-1 max-h-[100%] flex-col-reverse overflow-scroll  p-4 ">
            <For each={[...props.resultList].reverse()}>
                {(item) => {
                    return (
                        <li>
                            <span class="col-span-1 inline-block min-w-[8rem]">
                                {prettyBytes(item.buffer.byteLength)}
                            </span>
                            <span class="col-span-7">{item.name}</span>
                        </li>
                    );
                }}
            </For>
        </ul>
    );
}

/** 右上角的文件列表 */
function LogMessage(props: { logMessage: string[] }) {
    const [parent] = createAutoAnimate();
    return (
        <ul
            ref={parent}
            class="flex h-full max-h-[100%] select-text flex-col-reverse overflow-scroll rounded-xl bg-gray-800  p-4 font-sans text-xs text-white"
        >
            <For each={[...props.logMessage].reverse()}>
                {(item) => {
                    return <li innerHTML={ConsolePrint(item)}></li>;
                }}
            </For>
        </ul>
    );
}
/** 修饰文本为可见的颜色 */
export const ConsolePrint = (item: string) => {
    return item
        .replace(
            /\[97m\[1m(.*?)\[22m\[39m\[0m\[0m/g,
            '<span style="color: green;font-weight: bold;" >$1</span>'
        )
        .replace(
            /\[34m\[1m(.*?)\[22m\[39m\[0m\[0m/g,
            '<span style="color: blue;font-weight: bold;" >$1</span>'
        );
};