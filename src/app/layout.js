export const metadata = {
  title: 'Jorpor',
  icons: {
    icon: [
      '/favicon.ico?v=4',
    ]
  }
  
}
 
export default function RootLayout({children}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}


