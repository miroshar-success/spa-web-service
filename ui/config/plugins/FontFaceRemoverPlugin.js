"use strict"

var Compiler = require('webpack').Compiler
var fs = require('fs')

var compiler = new Compiler()

class FontFaceRemoverPlugin {
  apply(compiler) {
    compiler.plugin('after-emit', compilation => {
      var css = fs.readFileSync('./dist/styles/bundle.css', { encoding: 'utf8' })
      var foundedFontFaces = css.match(/@font-face\s*\{[^}]+}/g)
      var updatedCSS = css.replace(foundedFontFaces[2], '') // foundedFontFaces[2] - anticon fonts
      fs.writeFileSync('./dist/styles/bundle.css', updatedCSS)
    })
  }
}

module.exports = FontFaceRemoverPlugin