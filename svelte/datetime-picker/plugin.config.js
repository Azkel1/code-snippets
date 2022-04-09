import {svelte} from '@sveltejs/vite-plugin-svelte'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import css from 'rollup-plugin-css-only'
import { terser } from 'rollup-plugin-terser'
import sveltePreprocess from 'svelte-preprocess'

const production = false;

// include CSS in component's JS for ease of use
//
// set to true to get separate CSS for the component (but then,
// you'll need to inject it yourself at runtime somehow)
//
const emitCss = false

const cmp = 'DateTimePicker'

export default {

    build: {
        rollupOptions: {
            input: `src/lib/${cmp}.svelte`,

            output: {
                format: 'es',
                file: `dist/${cmp}.js`,
                sourcemap: true,
            },
        }
    },
    preprocess: sveltePreprocess(),
    plugins: [
        svelte({
            emitCss,
            compilerOptions: {
                dev: !production,
            },
        }),

        emitCss && css({ output: `${cmp}.css` }),

        resolve({
            browser: true,
            dedupe: ['svelte'],
        }),
        commonjs(),
        production && terser(),
    ],
}