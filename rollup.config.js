import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
import CleanCSS from 'clean-css';
import { writeFileSync } from 'fs';
import pkg from './package.json'

const name = 'cxDialog';
const about = `/**
 * cxDialog
 * @version ${pkg.version}
 * @author ciaoca
 * @email ciaoca@gmail.com
 * @site https://github.com/ciaoca/cxDialog
 * @license Released under the MIT license
 */`;

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/js/cxdialog.js',
      format: 'umd',
      name: name,
      banner: about,
      indent: false,
    },
    {
      file: 'dist/js/cxdialog.min.js',
      format: 'umd',
      name: name,
      banner: about,
      indent: false,
      plugins: [
        terser({
          compress: {}
        }),
      ],
    },
    {
      file: 'dist/js/cxdialog.es.js',
      format: 'es',
      banner: about,
      indent: false,
    },
  ],
  plugins: [
    css({
      // output: 'css/cxdialog.css'
      output(style) {
        writeFileSync('dist/css/cxdialog.css', new CleanCSS({
          format: 'beautify'
        }).minify(style).styles);
        writeFileSync('dist/css/cxdialog.min.css', new CleanCSS({
          format: 'keep-breaks'
        }).minify(style).styles);
      }
    })
  ]
};