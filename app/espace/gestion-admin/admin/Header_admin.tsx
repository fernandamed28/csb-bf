"use client";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
  Transition,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { getToken, removeToken } from "@/lib/auth/admin/token";
import { jwtDecode } from "jwt-decode";


const navigation = [
  { name: "Tableau de bord", href: "/espace/gestion-admin/admin/dashboard" },
  { name: "Gestion des activités", href: "/espace/gestion-admin/admin/activites" },
  { name: "Gestion Utilisateurs", href: "/espace/gestion-admin/admin/gestion-utilisateurs" },
];

function isActiveNav(pathname: string, href: string) {
  if (href === "/espace/gestion-admin/admin/activites") {
    return pathname === href || pathname.startsWith(href + "/");
  }
  return pathname === href;
}

type AdminTokenPayload = {
  id: number;
  email: string;
  nom?: string;
  prenom?: string;
  role?: string;
  exp?: number;
};

export default function HeaderAdmin() {
  const pathname = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState<{ nom?: string; prenom?: string; email?: string } | null>(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      try {
        const decoded = jwtDecode<AdminTokenPayload>(token);
        setAdmin({
          nom: decoded.nom,
          prenom: decoded.prenom,
          email: decoded.email,
        });
      } catch {
        setAdmin(null);
      }
    } else {
      setAdmin(null);
    }
  }, []);

  const handleLogout = () => {
    removeToken();
    router.replace("/compte/login/admin-csb-bf");
  };

  return (
    <Disclosure
      as="nav"
      className="bg-white/70 backdrop-blur-lg shadow-md sticky top-0 z-50 border-b border-blue-100"
    >
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-18 items-center justify-between">
              {/* LOGO + NAV */}
              <div className="flex items-center">
                <Link href="/" className="flex items-center gap-2">
                  <Image
                    src="/medias/images/csb_logo.png"
                    alt=""
                    width={40}
                    height={40}
                    className="rounded-md"
                  />
                </Link>
              </div>

              {/* Menu desktop */}
              <div className="hidden md:flex ml-10 space-x-4">
                {navigation.map((item) => {
                  const isActive = isActiveNav(pathname, item.href);
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
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>

              {/* Profil admin */}
              <div className="hidden md:flex items-center space-x-3">
                <span className="text-gray-700 font-semibold">
                  {admin?.prenom || ""} {admin?.nom || ""}{" "}
                  <span className="text-xs text-gray-400">{admin?.email}</span>
                </span>
                <Menu as="div" className="relative">
                  <MenuButton className="flex rounded-full bg-blue-100 p-1 hover:ring-2 hover:ring-blue-400 transition">
                    <UserCircleIcon className="h-9 w-9 text-blue-600" />
                  </MenuButton>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-150"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-100"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right bg-white border border-blue-100 divide-y divide-gray-100 rounded-xl shadow-lg ring-1 ring-black/5 focus:outline-none">
                      <MenuItem>
                        {({ active }) => (
                          <Link
                            href="/espace/gestion-admin/admin/profil"
                            className={clsx(
                              active ? "bg-blue-50 text-blue-700" : "",
                              "block px-4 py-2 text-sm font-semibold text-gray-700"
                            )}
                          >
                            Mon profil
                          </Link>
                        )}
                      </MenuItem>
                      <MenuItem>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={clsx(
                              active ? "bg-red-50 text-red-600" : "",
                              "block w-full text-left px-4 py-2 text-sm font-semibold text-gray-700"
                            )}
                          >
                            Déconnexion
                          </button>
                        )}
                      </MenuItem>
                    </MenuItems>
                  </Transition>
                </Menu>
              </div>

              {/* Menu mobile */}
              <div className="md:hidden">
                <DisclosureButton className="rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-blue-700">
                  {open ? (
                    <XMarkIcon className="h-6 w-6" />
                  ) : (
                    <Bars3Icon className="h-6 w-6" />
                  )}
                </DisclosureButton>
              </div>
            </div>
          </div>

          {/* Menu mobile */}
          <DisclosurePanel className="md:hidden bg-white border-t border-blue-100 shadow-md">
            <div className="space-y-1 px-4 py-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={clsx(
                    isActiveNav(pathname, item.href)
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-800 hover:bg-blue-50 hover:text-blue-700",
                    "block rounded-md px-3 py-2 text-base font-semibold"
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="block text-red-600 hover:bg-red-50 rounded-md px-3 py-2 text-base font-semibold w-full text-left"
              >
                Déconnexion
              </button>
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}