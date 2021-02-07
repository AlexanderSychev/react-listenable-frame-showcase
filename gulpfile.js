'use strict';

const path = require('path');
const fs = require('fs/promises');
const pluginTypeScript = require('@rollup/plugin-typescript');
const rimraf = require('rimraf-then');
const mkdirp = require('mkdirp');
const pug = require('pug');
const StaticServer = require('static-server');
const { rollup } = require('rollup');
const { terser } = require('rollup-plugin-terser');
const { parallel, series, watch } = require('gulp');

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const SRC_DIR = path.join(__dirname, 'src');
const DIST_DIR = path.join(__dirname, 'dist');

// -----------------------------------------------------------------------------
// Clean task
// -----------------------------------------------------------------------------

async function clean() {
  await rimraf(DIST_DIR);
  await mkdirp(DIST_DIR);
}

exports.clean = clean;

// -----------------------------------------------------------------------------
// Render pages task
// -----------------------------------------------------------------------------

/**
 * Render Pug template into HTML file
 * @param {string} srcFile Source Pug file
 * @param {string} distFile Target HTML file
 * @param {Object<string, string>} [params] Parameters for template
 */
async function renderPug(srcFile, distFile, params) {
  const content = await fs.readFile(srcFile, 'utf-8');
  await fs.writeFile(
    distFile,
    pug.compile(content, { filename: srcFile })(params),
    'utf8',
  );
}

function pages() {
  const indexSrcFile = path.join(SRC_DIR, 'pages', 'index.pug');
  const indexDistFile = path.join(DIST_DIR, 'index.html');
  const frameSrcFile = path.join(SRC_DIR, 'pages', 'frame.pug');
  const frame01DistFile = path.join(DIST_DIR, 'frame01.html');
  const frame02DistFile = path.join(DIST_DIR, 'frame02.html');

  return Promise.all([
    renderPug(indexSrcFile, indexDistFile),
    renderPug(frameSrcFile, frame01DistFile, { frameNumber: 1 }),
    renderPug(frameSrcFile, frame02DistFile, { frameNumber: 2 }),
  ]);
}

exports.pages = pages;

// -----------------------------------------------------------------------------
// Copy assets task
// -----------------------------------------------------------------------------

async function assets() {
  const originScriptPath = path.resolve(
    __dirname,
    path.join(
      'node_modules',
      'react-listenable-frame',
      'lib',
      'react-listenable-frame.min.js',
    ),
  );
  const targetScriptPath = path.join(DIST_DIR, 'react-listenable-frame.min.js');
  const originSourceMapPath = `${originScriptPath}.map`;
  const targetSourceMapPath = `${targetScriptPath}.map`;
  await Promise.all([
    fs.copyFile(originScriptPath, targetScriptPath),
    fs.copyFile(originSourceMapPath, targetSourceMapPath),
  ]);
}

exports.assets = assets;

// -----------------------------------------------------------------------------
// Bundle tasks
// -----------------------------------------------------------------------------

/**
 * Create script bundle task
 * @param {string} input Entry point file
 * @param {string} file Output bundle file
 */
async function bundle(input, file) {
  const builder = await rollup({
    input,
    external: [
      'react',
      'react-dom',
      'react-listenable-frame',
      'styled-components',
      'luxon',
    ],
    plugins: [
      pluginTypeScript(),
      terser({ format: { comments: false } }),
    ],
  });
  await builder.write({
    file,
    format: 'iife',
    exports: 'none',
    globals: {
      react: 'React',
      luxon: 'luxon',
      'react-dom': 'ReactDOM',
      'react-listenable-frame': 'ReactListenableFrame',
      'styled-components': 'styled',
    },
  });
}

function main() {
  return bundle(path.join(SRC_DIR, 'main.tsx'), path.join(DIST_DIR, 'main.js'));
}

exports.main = main;

function frame() {
  return bundle(
    path.join(SRC_DIR, 'frame.tsx'),
    path.join(DIST_DIR, 'frame.js')
  );
}

exports.frame = frame;

// -----------------------------------------------------------------------------
// Watch tasks
// -----------------------------------------------------------------------------

function watchTS() {
  const PATTERNS = [
    path.join(SRC_DIR, '**', '*.ts'),
    path.join(SRC_DIR, '**', '*.tsx'),
  ];
  return watch(PATTERNS, parallel(main, frame));
}

exports.watchTS = watchTS;

function watchPUG() {
  return watch(path.join(SRC_DIR, 'pages', '*.pug'), pages);
}

exports.watchPUG = watchPUG;

// -----------------------------------------------------------------------------
// Statis server task
// -----------------------------------------------------------------------------

function server() {
  const server = new StaticServer({
    rootPath: DIST_DIR,
    port: 8000,
    cors: '*',
  });
  return new Promise((resolve) => server.start(resolve));
}

exports.server = server;

// -----------------------------------------------------------------------------
// Main tasks
// -----------------------------------------------------------------------------

const build = series(
  clean,
  parallel(assets, main, frame, pages),
);

exports.build = build;

exports.default = series(
  build,
  parallel(server, watchTS, watchPUG),
);
