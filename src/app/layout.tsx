import type { Metadata } from 'next';
import { Lexend } from 'next/font/google';
import './globals.scss';
import Credits from '@/components/Credits';

const lexend = Lexend({ subsets: ['latin'], display: 'swap', variable: '--font-lexend' });

export const metadata: Metadata = {
  title: 'Asynconf 2023 - Tournoi',
  description: "Simulateur de taux d'intérêt réalisé dans le cadre du tournoi Asynconf 2023",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body
        className={`m-0 p-0 overflow-x-clip text-white w-full h-screen flex justify-center items-center font-sans ${lexend.variable}`}>
        {children}
        <Credits />
      </body>
    </html>
  );
}
