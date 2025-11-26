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
            // Stricter Shared Scope
            {
              sourceTag: 'scope:shared',
              onlyDependOnLibsWithTags: ['scope:shared'],
            },
            // Type Constraints
            {
              sourceTag: 'type:feature',
              onlyDependOnLibsWithTags: [
                'type:ui',
                'type:data-access',
                'type:util',
                'type:domain',
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
            // Original Domain Scopes (to be refactored)
            {
              sourceTag: 'scope:accounting',
              onlyDependOnLibsWithTags: ['scope:accounting', 'scope:shared', 'scope:localization', 'scope:notifications'],
            },
            // New, Stricter Domain Scopes
            {
              sourceTag: 'scope:ledger',
              onlyDependOnLibsWithTags: ['scope:ledger', 'scope:shared'],
            },
            {
              sourceTag: 'scope:journals',
              onlyDependOnLibsWithTags: ['scope:journals', 'scope:shared', 'scope:ledger'],
            },
            {
              sourceTag: 'scope:periods',
              onlyDependOnLibsWithTags: ['scope:periods', 'scope:shared', 'scope:ledger'],
            },
            {
              sourceTag: 'scope:reconciliation',
              onlyDependOnLibsWithTags: ['scope:reconciliation', 'scope:shared', 'scope:ledger'],
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
              onlyDependOnLibsWithTags: ['scope:users', 'scope:shared', 'scope:auth'],
            },
            {
              sourceTag: 'scope:auth',
              onlyDependOnLibsWithTags: ['scope:auth', 'scope:users', 'scope:shared', 'scope:localization'],
            },
            {
              sourceTag: 'scope:invoices',
              onlyDependOnLibsWithTags: ['scope:invoices', 'scope:shared', 'scope:customers', 'scope:inventory'],
            },
             {
              sourceTag: 'scope:taxes',
              onlyDependOnLibsWithTags: ['scope:taxes', 'scope:shared'],
            },
            // Platform constraints
            {
              sourceTag: 'platform:web',
              onlyDependOnLibsWithTags: ['platform:web', 'platform:shared'],
            },
            {
              sourceTag: 'platform:api',
              onlyDependOnLibsWithTags: ['platform:api', 'platform:shared'],
            },
            {
              sourceTag: 'platform:shared',
              onlyDependOnLibsWithTags: ['platform:shared'],
            },
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
    rules: {},
  },
];
