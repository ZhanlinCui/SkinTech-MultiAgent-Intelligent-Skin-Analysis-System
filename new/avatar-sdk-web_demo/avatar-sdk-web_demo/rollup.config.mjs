import nodePolyfills from 'rollup-plugin-node-polyfills'
import replace from '@rollup/plugin-replace'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import terser from '@rollup/plugin-terser'
import alias from '@rollup/plugin-alias'
// import { eslint } from 'rollup-plugin-eslint'
import clear from 'rollup-plugin-clear'
import Sass from 'sass'
import { dts } from 'rollup-plugin-dts'
import dynamicImportVars from '@rollup/plugin-dynamic-import-vars'
import semver from 'semver'
const BUILD_ID = process.env.BUILD_ID ?? 1001
const SDK_VERSION = process.env.SDK_VERSION || process.env.npm_package_version

if (!semver.valid(SDK_VERSION)) {
  throw new Error('invalid VERSION:' + SDK_VERSION)
}
const babelOptions = {
  presets: [
    ['@babel/preset-env', { modules: false }],
    '@babel/preset-typescript',
    '@babel/preset-react',
  ],
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
  exclude: [
    'node_modules/**', // 仅仅转译我们的源码
    '**/xrtc/**/*.js',
  ],
}
const processScss = function (context) {
  return new Promise((resolve, reject) => {
    Sass.compile(
      {
        file: context,
      },
      function (err, result) {
        if (!err) {
          resolve(result)
        } else {
          reject(result)
        }
      }
    )
    Sass.compile(context, {}).then(
      function (output) {
        if (output && output.css) {
          resolve(output.css)
        } else {
          reject({})
        }
      },
      function (err) {
        reject(err)
      }
    )
  })
}
export default [
  {
    // input: 'src/lib/core/recorder.ts',
    // // input: 'src/lib/core/index.ts',
    // output: {
    //   // file: `lib/${SDK_VERSION}/interactive.${
    //   //   process.env.format || 'iife'
    //   // }.js`,
    //   file: `lib/${SDK_VERSION}/recorder/${
    //     SDK_VERSION
    //   }/recorder.${process.env.format || 'iife'}.js`,
    //   format: process.env.format || 'iife',
    //   name: process.env.npm_package_name,
    //   globals: {},
    //   sourcemap: false,
    // },
    // input: 'src/lib/core/player.ts',
    input: 'src/lib/core/index.ts',
    // input: 'src/lib/core/avatarplatform.ts',
    output: {
      // file: `lib/${SDK_VERSION}/interactive.${
      //   process.env.format || 'iife'
      // }.js`,
      // file: `lib/${SDK_VERSION}/player/rtcplayer.${
      //   process.env.format || 'iife'
      // }.js`,
      // file: `lib/avatar-sdk-web/${
      //   SDK_VERSION
      // }.${BUILD_ID}/avatar-sdk-web-v${
      //   SDK_VERSION
      // }.${BUILD_ID}.${process.env.format || 'iife'}.js`,
      // dir: `lib/${SDK_VERSION}.${BUILD_ID}/rtcplayer_${SDK_VERSION}.${BUILD_ID}/`,
      dir: `lib/${SDK_VERSION}.${BUILD_ID}/avatar-sdk-web_${SDK_VERSION}.${BUILD_ID}/`,
      format: process.env.format || 'iife',
      name: process.env.npm_package_name,
      globals: {},
      sourcemap: false,
    },
    external: [
      'markdown-it',
      'markdown-it-link-attributes',
      '@traptitech/markdown-it-katex',
      'highlight.js',
    ],
    plugins: [
      replace({
        // 在源码中使用环境变量
        'process.env.version': JSON.stringify(`${SDK_VERSION}-${BUILD_ID}`),
      }),
      // postcss({
      //   extract: true,
      //   process: processScss,
      // }),
      alias({
        entries: {
          '@': './src',
        },
      }),
      // eslint({
      //   exclude: [/node_modules/],
      // }),
      // postcss(),
      typescript({
        tsconfig: './tsconfig.json',
      }),
      resolve(),
      commonjs(),
      dynamicImportVars(),
      clear({
        // required, point out which directories should be clear.
        targets: [
          `lib/${SDK_VERSION}.${BUILD_ID}/avatar-sdk-web_${SDK_VERSION}.${BUILD_ID}/`,
        ],
        // optional, whether clear the directores when rollup recompile on --watch mode.
        watch: true,
      }),
      nodePolyfills(),
      babel({
        ...babelOptions,
      }),
      terser({
        compress: {
          drop_console: false, //['log', 'info'],
        },
      }),
    ],
  },
  ...(process.env.format === 'esm'
    ? [
        {
          // input: './src/lib/typings/IPlayer.d.ts',
          input: './src/lib/typings/ICore.d.ts',
          output: [
            {
              // file: `lib/${SDK_VERSION}.${BUILD_ID}/rtcplayer_${SDK_VERSION}.${BUILD_ID}/index.d.ts`,
              file: `lib/${SDK_VERSION}.${BUILD_ID}/avatar-sdk-web_${SDK_VERSION}.${BUILD_ID}/index.d.ts`,
              format: 'es',
            },
          ],
          plugins: [dts()],
        },
      ]
    : []),
]
