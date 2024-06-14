import { reflect, resource, type Atom, atom } from '@cn-ui/reactive';
import prettyBytes from 'pretty-bytes';
import { Show } from 'solid-js';
import { ECharts } from '../fontDisplay/ECharts';
import { fetchEventSource } from '@microsoft/fetch-event-source'
export const CDNAnalyze = () => {
    const hotWebSite = atom<{ key: string[], value: number }[]>([])
    const data = resource(() => {
        return fetchEventSource('https://chinese-fonts-cdn.deno.dev/v1/deno-kv?get=["records","referer"]', {
            onmessage(e) {
                hotWebSite(i => ([...i, JSON.parse(e.data)]))
            }
        })
    });
    const hotLink = atom<{ key: string[], value: number }[]>([])
    const hotLinkData = resource(() => {
        return fetchEventSource('https://chinese-fonts-cdn.deno.dev/v1/deno-kv?get=["records","path"]', {
            onmessage(e) {
                hotLink(i => ([...i, JSON.parse(e.data)]))
            }
        })
    });
    return (
        <>
            <h2 class=" my-12 text-center text-3xl leading-9">
                中文网字计划 CDN 分析
            </h2>
            <section class="m-auto grid max-w-7xl grid-cols-2 gap-4">
                <div>
                    <div>
                        热门字体
                    </div>
                    <ul class='font-sans'>
                        {hotLink().sort((a, b) => b.value - a.value).filter(i => {
                            return !( i.value <= 50)
                        }).map(i => {
                            return <li class='flex'>
                                <span >

                                    {i.key.at(-1)}

                                </span>
                                <span class='flex-1'></span>
                                <span>{i.value}</span>
                            </li>
                        })}
                    </ul>
                </div>
                <div class=" col-span-1">
                    <div>
                        访问热榜
                    </div>
                    <ul class='font-sans'>
                        {hotWebSite().sort((a, b) => b.value - a.value).filter(i => {
                            const host = i.key.at(-1)
                            return !(/^localhost:\d+/.test(host!) || host === 'localhost' || !isNaN(parseInt(host)) || i.value <= 10)
                        }).map(i => {
                            return <li class='flex'>
                                <a href={'https://' + i.key.at(-1)}>

                                    {i.key.at(-1)}

                                </a>
                                <span class='flex-1'></span>
                                <span>{i.value}</span>
                            </li>
                        })}
                    </ul>
                </div>
            </section>
        </>
    );
};

/** 缓存比例饼图 */
const CacheRato = ({
    trafficCache,
}: {
    trafficCache: Atom<CDNData['data']['trafficCacheStatisticsModel']['trafficCache']>;
}) => {
    return (
        <ECharts
            options={{
                title: {
                    text: 'CDN 缓存结构',
                    left: 'center',
                    top: 20,
                },
                tooltip: {
                    trigger: 'item',
                    formatter(p: { value: number }) {
                        return prettyBytes(p.value);
                    },
                },
                legend: {
                    bottom: '5%',
                    left: 'center',
                },
                series: [
                    {
                        name: 'CDN 缓存结构',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        itemStyle: {
                            borderRadius: 10,
                            borderColor: '#fff',
                            borderWidth: 2,
                        },
                        data: [
                            {
                                value: trafficCache().unCache,
                                name: `缓存 ${prettyBytes(trafficCache().unCache)} ${trafficCache().unCacheRatio * 100
                                    } % `,
                            },
                            {
                                value: trafficCache().cache,
                                name: `缓存 ${prettyBytes(trafficCache().cache)} ${trafficCache().cacheRatio * 100
                                    } % `,
                            },
                        ],
                    },
                ],
            }}
        ></ECharts>
    );
};
