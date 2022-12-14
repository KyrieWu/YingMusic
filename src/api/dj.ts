import service from "@/utils/https";

// get dj catelist
export function getDjCatelist() {
    return service({
        url: '/dj/catelist',
        method: 'get'
    })
}