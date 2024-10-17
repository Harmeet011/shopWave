"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";
import UserDashboard from './UserDashboard';
import AdminPage from "@/app/admin/page";
import { Profile } from '../types/interfaces';
import {
  Disclosure,
  Menu,
  MenuButton,
  DisclosurePanel,
} from "@headlessui/react";

export default function Dashboard() {
  const [role, setRole] = useState<Profile['role'] | null>(null);
  const [email, setEmail] = useState<string | null | undefined>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      setEmail(user.email);

      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // Profile doesn't exist, create one
          const { error: insertError } = await supabase
            .from("profiles")
            .insert({ id: user.id, role: "user" });

          if (insertError) {
            console.error("Error creating user profile:", insertError);
            return;
          }
          setRole("user");
        } else {
          console.error("Error fetching user role:", error);
          return;
        }
      } else {
        setRole(data?.role || "user");
      }
    };

    fetchUserData();

    // Set up a listener for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        router.push('/login');
      }
    });

    // Clean up the listener when the component unmounts
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  if (!role || !email) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="min-h-full bg-gray-100">
        <Disclosure as="nav" className="bg-gray-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img
                    alt="Your Company"
                    src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500"
                    className="h-8 w-8"
                  />
                </div>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    <a className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">
                      ShopWave
                    </a>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="ml-4 flex items-center md:ml-6 space-x-4">
                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <MenuButton className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        Welcome, {email}
                      </MenuButton>
                    </div>
                  </Menu>
                  <form action="/api/auth/signout" method="post">
                    <button
                      type="submit"
                      className="bg-red-500 hover:bg-red-700 text-white font-medium py-1 px-3 rounded"
                    >
                      Logout
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <DisclosurePanel className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3"></div>
            <div className="border-t border-gray-700 pb-3 pt-4">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  {/*<img alt="" src={user.imageUrl} className="h-10 w-10 rounded-full" />*/}
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-white">
                    {email}
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1 px-2"></div>
            </div>
          </DisclosurePanel>
        </Disclosure>

        <header className="bg-white shadow-sm">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <h1 className="text-lg font-semibold leading-6 text-gray-900">
            {role === "admin" ? "Admin Dashboard" : "Customer Dashboard"}
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {role === "admin" ? (
              <AdminPage />
            ) : (
              <UserDashboard />
            )}
          </div>
        </main>
      </div>
    </>
  );
}
