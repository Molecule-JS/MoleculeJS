module.exports = {
  title: 'MoleculeJS',
  description: 'Declarative, flexible Custom Elements',
  ga: 'UA-122934953-1',
  serviceWorker: true,
  head: [
    ['link', { rel: 'icon', href: `/images/molecules.png` }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['meta', { name: 'theme-color', content: '#ff8f00' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'ff8f00' }],
    ['link', { rel: 'apple-touch-icon', href: `/images/apple-touch-icon.png` }],
    ['link', { rel: 'mask-icon', href: '/images/safari-pinned-tab.svg', color: '#ff8f00' }],
    ['meta', { name: 'msapplication-TileImage', content: '/images/mstile-150x150.png' }],
    ['meta', { name: 'msapplication-TileColor', content: '#00aba9' }]
  ],
  themeConfig: {
    serviceWorker: {
      updatePopup: true
    },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
    ],
    logo: '/molecules.svg',
    repo: 'Molecule-JS/MoleculeJS',
    editLinks: true,
    editLinkText: 'Help us improve this page!',
    lastUpdated: true,
    docsDir: 'docs',
    sidebar: {
      '/guide/': [
        {
          title: 'Guide',
          collapsable: false,
          children: [
            'installation',
            '',
            'lifecycle',
            'properties',
            'packages'
          ]
        },
      ]
    }
  }
}