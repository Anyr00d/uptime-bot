import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'UptimeBot',
  description: 'Monitor your services with ease.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}
