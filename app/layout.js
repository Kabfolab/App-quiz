export const metadata = { 
  title: 'Quiz App',
  manifest: '/manifest.json',
  themeColor: '#2563eb',
}

export default function RootLayout({ children }) {
  return (
    <html><body style={{fontFamily:'sans-serif', padding: '20px'}}>{children}</body></html>
  )
}
