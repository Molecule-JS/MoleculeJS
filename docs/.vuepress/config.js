module.exports = {
  title: 'MoleculeJS',
  description: 'Declarative, flexible Custom Elements',
  ga: 'UA-122934953-1',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
    ],
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