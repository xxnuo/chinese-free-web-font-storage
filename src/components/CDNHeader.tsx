export const CDNHeader = () => {
    return (
        <header class="sticky left-0 top-0 z-20 flex w-full flex-wrap items-center gap-2 border-b border-neutral-300 bg-white px-12 py-2 text-white print:hidden">
            <a href="/cdn" class="">
                <div class="text-2xl text-black">字图 CDN</div>
            </a>
            <a href="/" class="">
                <sup class="rounded-lg bg-red-400 px-2 text-white">中文网字计划</sup>
            </a>
            <span class="flex-1"></span>
            <nav class="flex gap-4 text-sky-700">
                <a href="/" class="hidden sm:block">
                    主页
                </a>
                <a href="/online-split" class="hidden sm:block">
                    字体分包
                </a>
                <a href="/article">文章</a>
                <span class="more-button relative overflow-visible">
                    <button>Github</button>
                </span>
            </nav>
        </header>
    );
};
