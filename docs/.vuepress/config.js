module.exports = {
  title: 'MoleculeJS',
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