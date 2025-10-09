"use client";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Accueil", href: "/" },
  { name: "Activités", href: "/compte/user/authentification" },
  { name: "Annonces", href: "#" },
  { name: "Contact", href: "/contact" },
];

const userNavigation = [
  { name: "S'inscrire", href: "/compte/user/inscription" },
  { name: "Se connecter", href: "/compte/user/authentification" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <Disclosure as="nav" className="bg-white/50 backdrop-blur-[15px] shadow-md sticky top-0 z-50 border-b border-white/20">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-18 items-center justify-between">
              {/* Logo + Navigation */}
              <div className="flex items-center">
                <Link href="/" className="shrink-0 flex items-center gap-2">
                  <Image
                    src="/medias/images/csb_logo.png"
                    alt="CSB Blog"
                    width={40}
                    height={40}
                    className="rounded-md"
                  />
                </Link>
                
              </div>

                
                {/* Menu desktop */}
                <div className="hidden md:flex items-center justify-center">
                    <div className="ml-10 flex items-baseline space-x-4">
                    {navigation.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={clsx(
                            "relative rounded-md px-3 py-2 text-base font-semibold transition-colors duration-200",
                            isActive
                              ? "text-[#1976d2] after:w-full"
                              : "text-gray-800 hover:text-[#1976d2] hover:after:w-full",
                            "after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-[#1976d2] after:w-0 after:transition-all after:duration-300"
                          )}
                          aria-current={isActive ? "page" : undefined}
                        >
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                
              {/* Boutons Connexion / Inscription */}
              <div className="hidden md:block">
                <div className="ml-4 flex items-center space-x-4">
                <Link
                  href="/compte/user/inscription"
                  className="rounded-md border border-[#1976d2] px-4 py-2 text-sm font-semibold text-[#1976d2] hover:bg-[#1976d2]/10 transition"
                >
                  S&apos;inscrire
                </Link>
                  <Link
                    href="/compte/user/authentification"
                    className="rounded-md bg-[#1976d2] text-white px-4 py-2 text-sm font-semibold shadow hover:bg-[#1976d2]/80 transition"
                  >
                    Se connecter
                  </Link>
                </div>
              </div>

              {/* Menu mobile (bouton burger) */}
              <div className="-mr-2 flex md:hidden">
                <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none">
                  <span className="sr-only">Ouvrir le menu principal</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </DisclosureButton>
              </div>
            </div>
          </div>

          {/* Menu mobile */}
          <DisclosurePanel className="md:hidden bg-white shadow-md">
            <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={clsx(
                      isActive
                        ? "bg-[#1976d2] text-white"
                        : "text-gray-800 hover:bg-gray-100 hover:text-[#1976d2]",
                      "block rounded-md px-3 py-2 text-base font-semibold"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
            {/* Section utilisateur */}
            <div className="border-t border-gray-200 pt-4 pb-3">
              <div className="mt-3 space-y-1 px-2">
                {userNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block rounded-md px-3 py-2 text-base font-semibold text-gray-700 hover:bg-gray-100 hover:text-[#1976d2]"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}