/**
 * Returns the number of digits after the decimal point for a given number.
 *
 * @param {string} number - String representation of a floating point number.
 * @return {number} - Number of digits after the decimal point.
 */
export function getDecimalLength(number) {
    const parts = number.split(".")
    if (parts.length === 2) {
        return parts[1].length
    }
    return 0
}

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

export function getQueryParam(param) {
    let queryString = window.location.search
    let urlParams = new URLSearchParams(queryString)
    return urlParams.get(param)
}

export function findLabel(chapterNumber, data, labels) {
    if (chapterNumber.endsWith('.0')) {
        chapterNumber = chapterNumber.replace('.0', '.1')
    }
    labels = labels.default
    let properties
    Object.keys(data).forEach(key => {
      data[key].forEach(node => {
        if (node.properties && node.properties.number === chapterNumber) {
          properties = node.properties
        }
      })
    })

    if (!properties) {
      console.warn('Data for the given chapter number not found:', chapterNumber)
      return null
    }
  
    // Using the found properties, lookup the labels
    let partLabel, sectionLabel, chapterLabel
    let vol = `Volume ${romanize(properties.volume)}`
    let part = `Part ${romanize(properties.part)}`
    let sect = properties.section
    let chap = properties.chapter

    try {
        const partObj = labels[vol][part]
        const sectObj = partObj.sections[sect]
        const chapObj = sectObj.chapters[chap]
    
        // Constructing the response object
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