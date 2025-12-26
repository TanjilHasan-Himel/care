import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Care.xyz | Trusted Baby & Elderly Care',
  description: 'Book reliable caregivers for babysitting, elderly care, and special care at home.',
  metadataBase: new URL('https://care.xyz.local'),
  openGraph: {
    title: 'Care.xyz | Trusted Care Services',
    description: 'Caregiving made easy, secure, and accessible for everyone.',
    url: 'https://care.xyz.local',
    siteName: 'Care.xyz'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <Providers>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <main style={{ flex: 1, paddingBottom: '64px', paddingTop: '32px' }}>{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
