/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-ui-to-auth-direct',
      severity: 'error',
      comment: 'Els components de UI no poden importar directament el directori auth. Usa els ports (adapters).',
      from: { path: '^src/(components|pages)/' },
      to:   { path: '^src/app/context/AuthContext' }
    },
    {
      name: 'no-ui-to-crdt-direct',
      severity: 'error',
      comment: 'La UI no pot parlar directament amb el motor CRDT o PowerSync. S\'ha d\'usar el SyncPort.',
      from: { path: '^src/(components|pages)/' },
      to:   { path: '^src/powersync/' }
    },
    {
      name: 'no-circular',
      severity: 'error',
      comment: 'Prohibides les dependències circulars. Són el camí cap a la bogeria arquitectònica.',
      from: {},
      to:   { circular: true }
    },
    {
      name: 'not-to-unresolvable',
      comment: 'No es poden importar mòduls que no existeixen o no es poden resoldre.',
      severity: 'error',
      from: {},
      to: { couldNotResolve: true }
    }
  ],
  options: {
    doNotFollow: {
      path: 'node_modules',
      dependencyTypes: ['npm', 'npm-dev', 'npm-optional', 'npm-peer', 'npm-bundled', 'npm-no-pkg']
    },
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: 'jsconfig.json'
    },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default']
    },
    reporterOptions: {
      dot: {
        collapsePattern: 'node_modules/[^/]+'
      }
    }
  }
};
