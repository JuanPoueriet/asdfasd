import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: false,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            {
              sourceTag: 'scope:shared',
              onlyDependOnLibsWithTags: ['scope:shared'],
            },
            {
              sourceTag: 'type:feature',
              onlyDependOnLibsWithTags: [
                'type:ui',
                'type:data-access',
                'type:util',
                'type:domain', // Allow features to use domain objects directly if needed
              ],
            },
            {
              sourceTag: 'type:ui',
              onlyDependOnLibsWithTags: ['type:util', 'type:domain', 'type:ui'],
            },
            {
              sourceTag: 'type:data-access',
              onlyDependOnLibsWithTags: [
                'type:domain',
                'type:util',
                'type:data-access',
              ],
            },
            {
              sourceTag: 'type:domain',
              onlyDependOnLibsWithTags: ['type:util', 'type:domain'],
            },
            {
              sourceTag: 'type:util',
              onlyDependOnLibsWithTags: ['type:util'],
            },
            // Domain Scopes
            {
              sourceTag: 'scope:accounting',
              onlyDependOnLibsWithTags: ['scope:accounting', 'scope:shared', 'scope:localization', 'scope:notifications'], // Accounting might need localization and notifications
            },
            {
              sourceTag: 'scope:customers',
              onlyDependOnLibsWithTags: ['scope:customers', 'scope:shared'],
            },
            {
              sourceTag: 'scope:inventory',
              onlyDependOnLibsWithTags: ['scope:inventory', 'scope:shared'],
            },
            {
              sourceTag: 'scope:users',
              onlyDependOnLibsWithTags: ['scope:users', 'scope:shared', 'scope:auth'], // Users might depend on auth context
            },
            {
              sourceTag: 'scope:auth',
              onlyDependOnLibsWithTags: ['scope:auth', 'scope:users', 'scope:shared', 'scope:localization'], // Auth uses users and localization
            },
            {
              sourceTag: 'scope:invoices',
              onlyDependOnLibsWithTags: ['scope:invoices', 'scope:shared', 'scope:customers', 'scope:inventory'], // Invoices need customers and inventory
            },
             {
              sourceTag: 'scope:taxes',
              onlyDependOnLibsWithTags: ['scope:taxes', 'scope:shared'],
            },
            // Platform constraints
            {
              sourceTag: 'platform:angular',
              onlyDependOnLibsWithTags: ['platform:angular', 'platform:shared'],
            },
            {
              sourceTag: 'platform:nest',
              onlyDependOnLibsWithTags: ['platform:nest', 'platform:shared'],
            },
            {
              sourceTag: 'platform:shared',
              onlyDependOnLibsWithTags: ['platform:shared'],
            },
            // Add other scopes as needed, defaulting to restrictive
          ],
        },
      ],
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    // Override or add rules here
    rules: {},
  },
];
