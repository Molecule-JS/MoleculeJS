module.exports = {
  title: 'MoleculeJS',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
    ],
    docsDir: 'docs',
    sidebar: {
      '/guide/': [
        {
          title: 'Guide',
          collapsable: false,
          children: [
            '',
            'properties'
          ]
        },
      ]
    }
  }
}