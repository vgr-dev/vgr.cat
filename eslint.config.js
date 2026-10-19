import astro from 'eslint-plugin-astro';

export default [
  {
    ignores: [
      'dist/',
      '.astro/',
      '.wrangler/',
      'node_modules/',
      'worker-configuration.d.ts',
    ],
  },
  // The plugin wires `astro-eslint-parser` plus the TypeScript sub-parser for
  // frontmatter itself, so no manual parser block is needed.
  ...astro.configs.recommended,
  ...astro.configs['jsx-a11y-recommended'],
];
