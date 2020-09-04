 /** 
 * 获取数组 item - 分割最后的item 组成新的数组
 * @author LiQingSong
 */
export const arrayItemSpiltNewArray = (val: string[]): string[] => {

    const arr:string[] = [];
    for (let index = 0, len = val.length; index < len; index+=1) {
        const element = val[index];
        const item = element.split('-').pop();
        if (item) {
            arr.push(item);
        }
    }

    return arr;
}