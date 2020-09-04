import { TableListItem } from "./data.d";

export const updateTreeDataChildren = (list: TableListItem[], pid: number, children: TableListItem[]) : TableListItem[] => {
    return list.map(item => {
        if (item.id === pid) {
            return {
                ...item,
                children,
            }
        } if (item.children) {
            return {
                ...item,
                children: updateTreeDataChildren(item.children, pid, children),
            }
        }
        return item;
    });
}

export const updateTreeDataChildItem = (list: TableListItem[], pid: number, childrenItem: TableListItem) : TableListItem[] => {
    return list.map(item => {
        if(item.id === pid) {
            const children = item.children || [];
            let num = 0;
            const newChild = children.map(item2 => {
                if(item2.id === childrenItem.id){
                    num += 1;
                    return {
                        ...item2,
                        ...childrenItem,
                    }
                }

                return item2;
            })
            if (num < 1) {
                newChild.push(childrenItem);
            }
            
            return {
                ...item,
                children: newChild,
            }
        }if (item.children) {
            return {
                ...item,
                children: updateTreeDataChildItem(item.children, pid, childrenItem),
            }
        }
        return item;
    });
}

export const updateTreeDataItem = (list: TableListItem[], item: TableListItem): TableListItem[] => {
    return list.map(listItem => {

        if(listItem.id === item.id) {
            return {
                ...listItem,
                ...item,
            }
        } if( listItem.children ) {
            return {
                ...listItem,
                children: updateTreeDataItem(listItem.children, item),
            }
        }
        return listItem;
    });
}

export const removeTreeDataItem = (list: TableListItem[], id: number): TableListItem[] => {
   const newList: TableListItem[] = [];
   for (let index = 0, len = list.length ; index < len; index +=1 ) {
       const element = list[index];
       if(element.id !== id) {

           if(element.children) {
               element.children = removeTreeDataItem(element.children, id);
           }

           newList.push(element);
       }
   } 

   return newList;
}

export const getTreeDataItem = (list: TableListItem[], id: number) : Partial<TableListItem> => {
    let item: Partial<TableListItem> = {};
    for (let index = 0, len = list.length; index < len; index += 1) {
        const element = list[index];
        if(element.id === id) {
            item = element;
            break;
        }         
        
        if (element.children) {
            item = getTreeDataItem(element.children,id);
            if(Object.keys(item).length) {
                break;
            }
        }
        
    }
    return item;
}
