/**
 * 添加棋子
 * @param {*被插入dom的dom} parentDom
 * @param {*} x, 棋子的x位置
 * @param {*} y, 棋子的y位子
 */
export function addChessKey (parentDom, isBlack, x, y) {
    let children = parentDom.children
    for (let child of children) {
        let childChildren = child.firstChild
        if (childChildren) {
            childChildren.className = childChildren.className.replace('just', '')
        }
    }
    let scopedAttr = parentDom.attributes[0]
    let div = document.createElement('div')
    let className = isBlack ? 'black-chess' : 'white-chess'
    div.innerHTML = `<div ${scopedAttr.name} class="chess ${className} just" style="top: ${y}px; left: ${x}px;"></div>`
    parentDom.appendChild(div)
}