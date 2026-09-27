import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Plateforme TTSFR | Accompagnement des Coopératives",
  description: "Un Modèle Évolutif pour la Transformation Durable des Coopératives (UM6P | GTI | Fondation OCP)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased min-h-screen flex flex-col bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
