import coreWebVitals from 'eslint-config-next/core-web-vitals'
import typescript from 'eslint-config-next/typescript'

/**
 * ESLint 9 flat config. eslint-config-next v16 ships native flat-config
 * arrays, so these are spread directly — wrapping them in FlatCompat
 * throws on a circular plugin reference.
 */
const eslintConfig = [
  ...coreWebVitals,
  ...typescript,
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'next-env.d.ts',
      'tsconfig.tsbuildinfo',
    ],
  },
]

export default eslintConfig
