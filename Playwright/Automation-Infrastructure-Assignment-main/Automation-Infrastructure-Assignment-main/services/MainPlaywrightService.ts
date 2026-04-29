import { APIRequestContext, expect } from "@playwright/test"
import { arrayToString, cleanText } from "../utils/helper"
import * as cheerio from "cheerio"

export class MainPlaywrightService {
    private readonly apiUrl = '/wiki/Playwright_(software)'

    constructor(private readonly request: APIRequestContext) {}

    async getDebuggingFeaturesList(): Promise<string> {
        const response = await this.request.get(this.apiUrl)
        expect(response.ok()).toBeTruthy()

        const html = await response.text()
        const $ = cheerio.load(html)

        const listItems = $('#Debugging_features').parent().nextAll('ul').first().find('li')

        const features: string[] = []
        listItems.each((_, el) => {
            const text = $(el).text()
            features.push(cleanText(text))
        })

        const cleanFeatures = features.filter(text => text.length > 0)
        return arrayToString(cleanFeatures)
    }

    async normalizeDebuggingFeaturesList(features: string[]) {
        return features
    }

    async countWords(features: string) {
        const words = cleanText(features).split(/\s+/)
        return words.length
    }
}
