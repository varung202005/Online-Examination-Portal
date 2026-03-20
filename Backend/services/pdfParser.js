const fs = require("fs")
const PDFParser = require("pdf2json")

function extractText(filePath) {

  return new Promise((resolve, reject) => {

    const pdfParser = new PDFParser()

    pdfParser.on("pdfParser_dataError", err => {
      console.error("PDF Parse Error:", err)
      reject(err)
    })

    pdfParser.on("pdfParser_dataReady", pdfData => {

      let text = ""

      pdfData.Pages.forEach(page => {
        page.Texts.forEach(textItem => {
          text += decodeURIComponent(textItem.R[0].T) + " "
        })
      })

      resolve(text)

    })

    pdfParser.loadPDF(filePath)

  })

}

module.exports = extractText