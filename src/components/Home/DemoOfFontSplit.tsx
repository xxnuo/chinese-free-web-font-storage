import viteLogo from '../../assets/viteLogo.svg'
import nextLogo from '../../assets/nextLogo.svg'
import nuxtLogo from '../../assets/nuxtLogo.svg'
import rspackLogo from '../../assets/rspackLogo.svg'
import astroLogo from '../../assets/astroLogo.svg'
import svelteLogo from '../../assets/svelteLogo.svg'
export const DemoOfFontSplit = () => {
    const linker = [
        null,null,
        {
            name: "Vite",
            href: "https://github.com/KonghaYao/cn-font-bundler-demo/tree/vite",
            pic: viteLogo,

        },
        {
            name: "Next.js",
            href: "https://github.com/KonghaYao/cn-font-bundler-demo/tree/nest",
            pic: nextLogo,

        },
        {
            name: "Nuxt",
            href: "https://github.com/KonghaYao/cn-font-bundler-demo/tree/nuxt",
            pic: nuxtLogo,

        },
        {
            name: "Astro",
            href: "https://github.com/KonghaYao/cn-font-bundler-demo/tree/astro",
            pic: astroLogo,

        },
        {
            name: "SvelteKit",
            href: "https://github.com/KonghaYao/cn-font-bundler-demo/tree/svelte-kit",
            pic: svelteLogo,

        },
        {
            name: "Rspack",
            href: "https://github.com/KonghaYao/cn-font-bundler-demo/tree/rspack",
            pic: rspackLogo,
        }
    ]
    return <nav class='grid grid-cols-12 gap-4 items-center py-12 hover:bg-gray-100 transition-colors px-8'>
        <div class='font-sans col-span-4'>
            <span class='text-xl  font-bold hover:text-green-600 transition-colors'>
                <a href='https://www.npmjs.com/package/vite-plugin-font' target='_blank'>
                    ⚡ vite-plugin-font ⚡
                </a>
            </span>
            <br />
            <span class='text-md text-gray-600 mt-4'>
                简单的中文字体前端工具链支持
                <br />
                ✅ 缓存 | ✅ 分包 | ✅ 自动构建
            </span>
            <br />
            <a href='https://www.npmjs.com/package/vite-plugin-font' class='text-red-600' target='_blank'>
                NPM 文档
            </a>
        </div>
        {linker.map(item => {
            if(!item) return <div></div>
            return <a href={item.href} target='_blank' class='hover:bg-gray-200 cursor-pointer p-2 flex flex-col items-center  transition-colors'>
                <img src={item.pic.src} alt={item.name} />
                <div>{item.name}</div>
                <div>
                    Demo
                </div>
            </a>
        })}

    </nav>
}