import '@/app/globals.css'
export const metadata = {
  title: 'Investment Tracker',
  description: 'Investment Tracker made by Rodrigo Piñel'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
