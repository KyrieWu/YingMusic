import service from "../utils/https";

// 获得轮播图
export function getBanner() {
    return service({
        url: '/banner?type=0',
        method: 'GET'
    })
}