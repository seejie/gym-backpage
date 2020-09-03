import request from '@/utils/request'

export function topiclist(query) {
    return request({
        url: '/gonglue/shq/topiclist',
        method: 'get',
        params: query
    })
}
