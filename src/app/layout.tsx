import type {Metadata} from 'next';
import './globals.css';
import { ToasterProvider } from '@/components/toaster-provider';

export const metadata: Metadata = {
  title: 'OptimumPulse',
  description: 'Твой умный спортивный помощник',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {children}
        <ToasterProvider />
      </body>
    </html>
  );
}
