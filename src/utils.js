/**
 * Returns the number of digits after the decimal point for a given number.
 *
 * @param {string} number - String representation of a floating point number.
 * @return {number} - Number of digits after the decimal point.
 */
export function getDecimalCount(number) {
    const parts = number.split(".")
    if (parts.length === 2) {
        return parts[1].length
    }
    return 0
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