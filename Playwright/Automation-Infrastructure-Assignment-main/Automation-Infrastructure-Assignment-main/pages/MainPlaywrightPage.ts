import { Locator, Page, expect, test } from "@playwright/test"
import { arrayToString, cleanText } from "../utils/helper"

export class MainMainPlaywrightPage {
    private readonly debuggingFeaturesHeader: Locator
    private readonly debuggingFeaturesList: Locator
    private readonly showMicrosoftToolsButton: Locator
    private readonly microsoftToolsTable: Locator
    private readonly darkColorInputButton: Locator
    private readonly themes = {
        night: {
            background: 'rgb(32, 33, 34)',
            text: 'rgb(234, 236, 240)'
        },
        day: {
            background: 'rgb(248, 249, 250)',
            text: 'rgb(32, 33, 34)'
        }
    }

    constructor(private readonly page: Page) {
        this.debuggingFeaturesHeader = page.locator('//h3[@id="Debugging_features"]')
        this.debuggingFeaturesList = page.locator('//h3[@id="Debugging_features"]/following::ul[1]/li')
        this.showMicrosoftToolsButton = page.locator('//div[contains(@id, "Microsoft_development_tools")]//..//span[@class="mw-collapsible-text"]')
        this.microsoftToolsTable = page.locator('table').filter({ hasText: /Microsoft development tools/i }).first()
        this.darkColorInputButton = page.locator('#skin-client-pref-skin-theme-value-night')
    }

    backgroundColor(time: string): Locator {
        return this.page.locator(`//html[contains(@class, "kin-theme-clientpref-${time}")]`)
    }

    async goto() {
        await this.page.goto('/wiki/Playwright_(software)')
        await this.debuggingFeaturesHeader.waitFor()
    }

    async getDebuggingFeaturesList() {
        const features = await this.debuggingFeaturesList.allTextContents()
        return features.map(feature => cleanText(feature)).filter(text => text.length > 0)
    }

    async normalizeDebuggingFeaturesList(features: any) {
        return arrayToString(features)
    }

    async countWords(features: string) {
        const words = cleanText(features).split(' ')
        return words.length
    }

    async openMicrosoftTools() {
        await this.showMicrosoftToolsButton.click()
        await this.microsoftToolsTable.waitFor({ state: 'visible' })
    }

    async validateAllTechnologyNamesAreLinks() {
        await expect(this.microsoftToolsTable).toBeVisible()
        const uls = this.microsoftToolsTable.locator('td.navbox-list ul')
        const ulCount = await uls.count()
        const allItems: string[] = []
        const validLinks: string[] = []
        const failedItems: string[] = []
        for (let x = 0; x < ulCount; x++) {
            const ul = uls.nth(x)
            const results = await ul.evaluate((node) => {
                function walk(node: Node, insideAnchor = false, href: string | null = null) {
                    const output: { text: string; href: string | null }[] = []
                    if (node.nodeType === Node.TEXT_NODE) {
                        const text = node.textContent?.replace(/\s+/g, ' ').trim()
                        if (text && text.length > 1) {
                            output.push({
                                text,
                                href: insideAnchor ? href : null
                            })
                        }
                    }
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const el = node as HTMLElement
                        const isAnchor = el.tagName === 'A'
                        const anchorHref = isAnchor
                            ? (el as HTMLAnchorElement).getAttribute('href')
                            : href
                        el.childNodes.forEach(child => {
                            output.push(...walk(child, insideAnchor || isAnchor, anchorHref))
                        })
                    }
                    return output
                }
                return walk(node)
            })
            for (const item of results) {
                const name = cleanText(item.text)
                if (!name) continue
                allItems.push(name)
                const isValid = item.href && item.href.length > 1 && !item.href.includes('javascript:')
                if (isValid) {
                    validLinks.push(`name: ${name} -> link: ${item.href}`)
                } else {
                    failedItems.push(`name: ${name} -> missing link`)
                }
            }
        }
        expect(failedItems, `Invalid technology links:\n${failedItems.join('\n')}`).toHaveLength(0)
    }

    async changeBackgroundColorToDark() {
        await this.darkColorInputButton.waitFor({ state: 'visible' })
        await this.darkColorInputButton.click()
    }

    async assertThemeColors(mode: 'day' | 'night') {
        const body = this.page.locator('body')
        const expected = this.themes[mode]
        
        await expect(body).toHaveCSS('background-color', expected.background)
        await expect(body).toHaveCSS('color', expected.text)
    }

    async assertSnapshot(name: string) {
        await expect(this.page).toHaveScreenshot(['theme-tests', `${name}.png`], {
            animations: 'disabled',
            maxDiffPixelRatio: 0.05
        })
    }
}
