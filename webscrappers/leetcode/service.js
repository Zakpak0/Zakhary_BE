import { getRecentSubs } from './index.js'

export const mapLeetcodeData = (recentSubs) => {
    getRecentSubs((callback) => {
        recentSubs(callback)
    })
}