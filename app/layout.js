export const metadata = { title: 'Quiz App' }
export default function RootLayout({ children }) {
  return (
    <html><body style={{fontFamily:'sans-serif', padding: '20px'}}>{children}</body></html>
  )
  }
