import { terser } from 'rollup-plugin-terser'

export default [
  // Bundle función (CommonJS + ESM)
  {
    input: 'src/index.js',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        sourcemap: true
      },
      {
        file: 'dist/index.module.js',
        format: 'esm',
        sourcemap: true
      }
    ],
    plugins: [terser()]
  },

  // Bundle Web Component en formato IIFE (para incluir directo con <script>)
  {
    input: 'src/webcomponent/register.js',
    output: {
      file: 'dist/avatarverse-webcomponent.js',
      format: 'iife',
      name: 'AvatarverseWebComponent',
      sourcemap: true
    },
    plugins: [terser()]
  },

  // Bundle Web Component en formato ESM (para importarlo como módulo)
  {
    input: 'src/webcomponent/register.js',
    output: {
      file: 'dist/avatarverse-webcomponent.module.js',
      format: 'esm',
      sourcemap: true
    },
    plugins: [terser()]
  }
]
