export const seoRedirects = [
  { source: '/products', destination: '/store', permanent: true },
  { source: '/products/:tech', destination: '/product/:tech', permanent: true },
  { source: '/shop', destination: '/store', permanent: true },
  { source: '/journal', destination: '/blog', permanent: true },
  { source: '/journal/:slug', destination: '/blog/:slug', permanent: true },
  { source: '/science', destination: '/research', permanent: true },
  { source: '/sign-in', destination: '/login', permanent: true },
  { source: '/signin', destination: '/login', permanent: true },
  { source: '/account/login', destination: '/login', permanent: true },
  { source: '/support', destination: '/help?tab=support', permanent: true },
  { source: '/guarantee', destination: '/returns', permanent: true },
] as const;
