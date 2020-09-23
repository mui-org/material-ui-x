import typescript from 'rollup-plugin-typescript2';
import cleaner from 'rollup-plugin-cleaner';
import sourceMaps from 'rollup-plugin-sourcemaps';
import { terser } from 'rollup-plugin-terser';
import commonjs from 'rollup-plugin-commonjs';
import dts from 'rollup-plugin-dts';
import command from 'rollup-plugin-command';
import pkg from './package.json';

// dev build if watching, prod build if not
const production = !process.env.ROLLUP_WATCH;
export default [
  {
    input:   'src/index.ts',
    output: [
      {
        file: 'dist/index-esm.js',
        format: 'esm',
        sourcemap: !production,
      },
      {
        file: 'dist/index-cjs.js',
        format: 'cjs',
        sourcemap: !production,
      },
    ],

    external: [...Object.keys(pkg.peerDependencies || {})],
    plugins: [
      production &&
        cleaner({
          targets: ['./dist/'],
        }),
      typescript(),
      commonjs(),
      !production && sourceMaps(),
      production && terser(),
    ],
  },
  {
    input: './dist/index.d.ts',
    output: [{ file: 'dist/x-license.d.ts', format: 'es' }],
    plugins: [
      dts(),
      !production && sourceMaps(),
      production && command([
        `rm -rf ./dist/encoding/`,
        `rm -rf ./dist/index*.d.ts`,
        `rm -rf ./dist/license*.d.ts`,
        `rm -rf ./dist/use*.d.ts`,
        `rm -rf ./dist/use*.d.ts`,
        `rm -rf ./dist/verify*.d.ts`,
      ], {
        exitOnFail: true,
        wait: true,
      }),
    ],
  },
];
