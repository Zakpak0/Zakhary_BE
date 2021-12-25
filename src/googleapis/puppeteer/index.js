import puppeteer from "puppeteer"
import fs from "fs"
import { mapLeetcodeData } from "../../webscrappers/leetcode/service.js"
/**
 * How to check cache
 * const requests = new Map()
 * page.on('request', req => {
 * return requests.set(req.url(), req)})
 * 
 * Leetcode selectors
 * password = password
 * username = username
 */
export const getSubmissionShots = async (callback) => {
    mapLeetcodeData(async (data) => {
        (async () => {
            const browser = await puppeteer.launch({ headless: false })
            const browserWSEndpoint = browser.wsEndpoint();
            const loginPage = await browser.newPage();
            await loginPage.goto("https://leetcode.com/accounts/login/")
            if (process.env.NODE_ENV == "development") {
                fs.readFile("../../.env.json", async (err, content) => {
                    if (err) return console.log("Error loading client secret file:", err);
                    let creds = JSON.parse(content)
                    const username = await loginPage.$('#id_login')
                    await username.type(creds.LEET_CODE_PROD.username)
                    const password = await loginPage.$("#id_password")
                    await password.type(creds.LEET_CODE_PROD.password)
                    setTimeout(async () => {
                        await password.press('Enter').then(async () => {
                            loginPage.on('domcontentloaded', async () => {
                                let snapshots = []
                                for (let i = 0; i < data.length; i++) {
                                    let urlSubTitle = data[i].title.trim().replace(/ /g, '-').toLowerCase()
                                    let trimmedSubTitle = data[i].title.replace(/ /g, '').toLowerCase()
                                    const submissionPage = await browser.newPage()
                                    await submissionPage.goto(`https://leetcode.com/submissions/detail/${data[i].id}`)
                                    await submissionPage.setViewport({
                                        width: 1000,
                                        height: 800,
                                        deviceScaleFactor: 1,
                                    })
                                        .then(async () => {
                                            const edit = await submissionPage.$("#edit-code-btn")
                                            await edit.click().then(async () => {
                                                submissionPage.on('domcontentloaded', async () => {
                                                    setTimeout(async () => {
                                                        snapshots.push({
                                                            name: trimmedSubTitle,
                                                            path: `../../submissions/${urlSubTitle}.jpg`
                                                        })
                                                        submissionPage.screenshot({ path: `../../submissions/${urlSubTitle}.jpg` })
                                                        setTimeout(() => {
                                                            submissionPage.close()
                                                            if (i + 1 == data.length) {
                                                                callback(snapshots)
                                                                browser.close()
                                                            }
                                                        }, 3000)
                                                    }, 3000)
                                                })
                                            })
                                        }
                                        )

                                }
                            })
                        })
                    }, 1000)
                })
            } else {
                const username = await page.$('#id_login')
                await username.type(process.env.LEET_CODE_PROD.username)
                const password = await page.$("#id_password")
                await password.type(procces.env.LEET_CODE_PROD.password)
                setTimeout(async () => {
                    await password.press('Enter')
                }, 1000)
                page.close()
            }
        })
    })
}