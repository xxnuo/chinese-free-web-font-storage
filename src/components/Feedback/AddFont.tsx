import { atom, ObjectAtom } from '@cn-ui/reactive';
import { addFontRequest } from '../../api/commit';
import { Notice } from '../../Notice';
import { Dialog } from './Dialog';
import { VModel } from '../../utils/VModel';
export const AddFont = () => {
    const panelVisible = atom(false);
    const a = ObjectAtom<Parameters<typeof addFontRequest>[0]>({
        fontName: '',
        nickName: '',
        detail: '',
        url: '',
    });
    return (
        <>
            <button onclick={() => panelVisible(true)}>添加字体</button>
            <Dialog
                title="添加字体"
                onSubmit={() => {
                    if (a.fontName() && a.nickName() && a.detail() && a.url()) {
                        panelVisible(false);
                        Notice.success('您的请求已记录, 我们将会在一周内处理');
                        addFontRequest(a()).then((res) => {
                            console.log(res);
                        });
                    } else {
                        Notice.error('请填写完整信息');
                    }
                }}
                visible={panelVisible}
            >
                <form action="" class="flex flex-col gap-4 p-4">
                    <input
                        type="text"
                        class="text-input"
                        placeholder="需要添加字体的名称"
                        {...VModel(a.fontName)}
                    ></input>
                    <input
                        type="text"
                        class="text-input"
                        placeholder="你的名字"
                        {...VModel(a.nickName)}
                    ></input>
                    <textarea
                        class="text-input"
                        style={{ resize: 'none' }}
                        placeholder="请你描述一下字体"
                        {...VModel(a.detail)}
                    ></textarea>
                    <input
                        type="text"
                        class="text-input"
                        placeholder="提供一个 URL 地址或者来源"
                        {...VModel(a.url)}
                    ></input>
                </form>
            </Dialog>
        </>
    );
};
