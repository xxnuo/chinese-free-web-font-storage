import { saveAs } from 'file-saver';
import { resource, type Atom } from '@cn-ui/reactive';
import { Notice } from '../../Notice';

/** 压缩文件 */
export function useZip(getFileName: () => string, resultList: Atom<{ name: string; buffer: Uint8Array; }[]>) {
    return resource(
        async () => {
            const name = getFileName();
            const { default: JSZip } = await import('jszip');
            const zip = new JSZip();
            const folder = zip.folder(name)!;
            resultList().forEach((i) => {
                folder.file(i.name, i.buffer);
            });

            return zip.generateAsync({ type: 'blob' }).then(function (content: Blob) {
                Notice.success('压缩文件下载中');
                saveAs(content, name + '.zip');
            });
        },
        { immediately: false,
             onError: (e) => {
            Notice.error(e)
        } }
    );
}
