import { Geist, Inter } from 'next/font/google';
import './globals.css';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: 'Scholastic Curator — Academic Management System',
  description: 'A premier research destination for scholars and administrators. Managing academic rigor through precision data, intuitive interfaces, and institutional legacy.',
  keywords: 'academic, university, management, courses, students, schedules',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geist.variable} ${inter.variable}`}>
      <body className="font-sans antialiased bg-slate-50 text-slate-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
