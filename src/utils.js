/**
 * Retrieves the length of the decimal part of a given number represented as a string.
 *
 * This function splits the number by the decimal point and returns the length of the decimal part if it exists.
 * If the number does not have a decimal part, it returns `0`.
 *
 * @param {string} number - The number as a string from which to determine the length of the decimal part.
 * @returns {number} The length of the decimal part of the number, or `0` if there is no decimal part.
 *
 * @example
 * // Example with a decimal part
 * const length = getDecimalLength('123.456')
 * console.log(length) // Outputs: 3
 *
 * @example
 * // Example without a decimal part
 * const length = getDecimalLength('123')
 * console.log(length) // Outputs: 0
 */
export function getDecimalLength(number) {
    const parts = number.split(".")
    if (parts.length === 2) {
        return parts[1].length
    }
    return 0
}


/**
 * Retrieves the decimal part of a given number represented as a string.
 *
 * This function splits the number by the decimal point and returns the decimal part if it exists.
 * If the number does not have a decimal part, it returns `null`.
 *
 * @param {string} number - The number as a string from which to extract the decimal part.
 * @returns {string|null} The decimal part of the number, or `null` if there is no decimal part.
 *
 * @example
 * // Example with a decimal part
 * const decimal = getDecimalPart('123.456')
 * console.log(decimal) // Outputs: '456'
 *
 * @example
 * // Example without a decimal part
 * const decimal = getDecimalPart('123')
 * console.log(decimal) // Outputs: null
 */
export function getDecimalPart(number) {
    const parts = number.split(".")
    if (parts.length === 2) {
        return parts[1]
    }
    return null
}


/**
 * Downloads the provided chapter data as a JSON file.
 *
 * @param {Object[]} allChapterData - An array of chapter data objects to be downloaded.
 * @throws {Error} Throws an error if the browser does not support Blob or URL.createObjectURL.
 */
export function downloadData(allChapterData) {
    // After looping through all chapters, save allChapterData to a file
    const jsonString = JSON.stringify(allChapterData, null, 2)
    const blob = new Blob([jsonString], {
        type: "application/json"
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'all_chapter_nodes.json'
    a.click()
    URL.revokeObjectURL(url)
  }

/**
 * Converts a given number to its Roman numeral representation.
 * 
 * Roman numerals are created by combining symbols and adding values. This function handles numbers up to 3999 (inclusive). For numbers outside this range, an 'Appendix' string is returned. The Roman numeral system uses seven symbols: I, V, X, L, C, D, and M.
 *
 * @param {number} num - The number to be converted to a Roman numeral. Should be a positive integer.
 * @returns {string} The Roman numeral representation of the given number. Returns 'Appendix' for non-numeric inputs or numbers outside the range of standard Roman numeral representation.
 */
  export function romanize (num) {
    if (isNaN(num))
        return "Appendix"
    var digits = String(+num).split(""),
        key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
               "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
               "","I","II","III","IV","V","VI","VII","VIII","IX"],
        roman = "",
        i = 3
    while (i--)
        roman = (key[+digits.pop() + (i * 10)] || "") + roman
    return Array(+digits.join("") + 1).join("M") + roman
}

/**
 * Retrieves the value of a specified query parameter from the URL.
 *
 * This function parses the current page's URL and extracts the value of the given query parameter.
 * If the parameter is not found, it returns `null`.
 *
 * @param {string} param - The name of the query parameter to retrieve.
 * @returns {string|null} The value of the query parameter, or `null` if the parameter is not present.
 *
 * @example
 * // Assuming the URL is: http://example.com/?foo=bar
 * const value = getQueryParam('foo')
 * console.log(value) // Outputs: 'bar'
 *
 * @example
 * // Assuming the URL is: http://example.com/?foo=bar
 * const value = getQueryParam('baz')
 * console.log(value) // Outputs: null
 */
export function getQueryParam(param) {
    let queryString = window.location.search
    let urlParams = new URLSearchParams(queryString)
    return urlParams.get(param)
}


/**
 * Finds the labels for a given chapter number from the provided data and labels.
 *
 * This function attempts to locate the correct labels for a chapter by its number. If the chapter number
 * ends with '.0', it increments the suffix until it finds a match or exceeds a limit. Once found,
 * it retrieves the corresponding labels from the provided labels object.
 *
 * @param {string} chapterNumber - The chapter number to find labels for. If it ends in '.0', the function will try to find a suffix that matches.
 * @param {Object} data - The data object containing chapter information. It is expected to be structured with nested objects containing `properties`.
 * @param {Object} labels - The labels object containing titles for volumes, parts, sections, and chapters.
 * @returns {Object|null} An object containing the part, section, and chapter labels if found, otherwise `null`.
 *
 * @example
 * const chapterNumber = '1.0'
 * const data = {
 *   volume1: [{ properties: { number: '1.1', volume: 1, part: 1, section: 1, chapter: 1 } }]
 * }
 * const labels = {
 *   default: {
 *     "Volume I": {
 *       "Part I": {
 *         title: "Part 1 Title",
 *         sections: {
 *           1: {
 *             title: "Section 1 Title",
 *             chapters: {
 *               1: { title: "Chapter 1 Title" }
 *             }
 *           }
 *         }
 *       }
 *     }
 *   }
 * }
 * const result = findLabel(chapterNumber, data, labels)
 * console.log(result) // Outputs: { "part-label": "Part 1 Title", "sect-label": "Section 1 Title", "chap-label": "Chapter 1 Title" }
 */
export function findLabel(chapterNumber, data, labels) {
    if (chapterNumber.endsWith('.0')) {
        let baseNumber = chapterNumber.split('.')[0]
        let suffix = 1
        let found = false
  
        while (!found && suffix <= 10) { 
            chapterNumber = `${baseNumber}.${suffix}`
            for (const key of Object.keys(data)) {
                for (const node of data[key]) {
                    if (node.properties && node.properties.number === chapterNumber) {
                        found = true
                        break
                    }
                }
                if (found) break
            }
            suffix++
        }
        if (!found) chapterNumber = `${baseNumber}.0`
    }
  
    labels = labels.default
    let properties = null
  
    for (const key of Object.keys(data)) {
        for (const node of data[key]) {
            if (node.properties && node.properties.number === chapterNumber) {
                properties = node.properties
                break
            }
        }
        if (properties) break
    }
  
    if (!properties) {
        console.warn('Data for the given chapter number not found:', chapterNumber)
        return null
    }
  
    // Using the found properties, lookup the labels
    let vol = `Volume ${romanize(properties.volume)}`
    let part = `Part ${romanize(properties.part)}`
    let sect = properties.section
    let chap = properties.chapter
  
    try {
        const partObj = labels[vol][part]
        const sectObj = partObj.sections[sect]
        const chapObj = sectObj.chapters[chap]
  
        const response = {
          "part-label": partObj.title,
          "sect-label": sectObj.title,
          "chap-label": chapObj.title
        }
  
        return response
    } catch (error) {
        console.error("An error occurred while trying to find the titles:", error)
        return null
    }
  }
  
