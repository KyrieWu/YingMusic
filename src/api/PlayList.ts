import service from "@/utils/https";

// get songlist detail 
export function getSongListInfo(id: any) {
    id = Number(id)
    return service({
        url: `/playlist/detail?id=${id}`,
        method: 'get'
    })
}

// get playlist category
export function getPlayListCategory() {
    return service({
        url: '/playlist/catlist',
        method: 'get'
    })
}

// get related playlist
export function getRelatedPlayList(id: any) {
    id = Number(id)
    return service({
        url: `/related/playlist?id=${id}`,
        method: 'get'
    })
}

//get simi playlist
export function getSimiPlayList(id: any) {
    id = Number(id)
    return service({
        url: `/simi/playlist?id=${id}`,
        method: 'get'
    })
}