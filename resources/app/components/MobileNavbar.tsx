import React, { Dispatch, SetStateAction, useEffect, useMemo } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenuToggle,
  NavbarMenu,
  Listbox,
  ListboxSection,
  ListboxItem,
  User,
  Skeleton
} from "@heroui/react";
import { useLocation } from "react-router-dom";
import { useLogout } from "@/hooks/useLogout";
import { UserActions } from "./UserActions";

export type RouteSegment = {
    segment: string;
    path: string;
  };

  interface SidebarProps {
    setTitle: Dispatch<SetStateAction<string>>;
    menuOptions: {
      section: string;
      options: {
        path: string;
        label: string;
        key: string;
        icon: React.ReactNode;
        permission: string[];
        title: string;
      }[];
    }[];
    changePasswordModal: () => void;
  }

export default function MobileNavbar ({ setTitle, menuOptions, changePasswordModal }: SidebarProps) {
  const { user, handleLogout } = useLogout();

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { pathname } = useLocation();

  const currentSegment = useMemo((): RouteSegment => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    return {
      segment: pathSegments[0] || "",
      path: location.pathname
    };
  }, [pathname]);

  useEffect(() => {
    const foundOption = menuOptions
      .flatMap(section => section.options)
      .find(option => option.path === pathname);
    setTitle(foundOption?.title ?? "");
  }, [pathname]);

  return (
    <Navbar isMenuOpen={isMenuOpen} classNames={{ wrapper: "pl-4" }}>
      <NavbarContent className="justify-between">
        <NavbarBrand>
          <UserActions
            triggerComponent={
              <User
                className="cursor-pointer"
                name={ user?.fullName ?? <Skeleton className="w-[140px] h-[18px] my-[1px] rounded-sm" /> }
                description={
                  user?.fullName
                    ? user?.role.name + (user?.specialty ? ` - ${user.specialty.name}` : "")
                    : <Skeleton className="w-[140px] h-[14px] my-[1px] rounded-sm" />
                }
                avatarProps={{
                  showFallback: true,
                  src: "./favicon.ico",
                  radius: "none",
                  classNames: {
                    base: "bg-transparent !h-[30px] !w-[30px]",
                    img: " object-contain"
                  }
                }}
              />
            }
            onAction={(key) => {
              if (key === "change-password") {
                changePasswordModal();
              }

              if (key === "logout") {
                handleLogout();
              }
            }}
          />
        </NavbarBrand>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        />
      </NavbarContent>

      <NavbarMenu>
        <Listbox
          aria-label="menu-sidebar"
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={pathname}
        >
          {menuOptions.map((section) => (
            <ListboxSection key={section.section} title={section.section} aria-label={section.section}>
              {section.options
                .filter(option => option.permission.includes(user?.role.id ?? ""))
                .map((option) => (
                  <ListboxItem
                    id={option.path}
                    key={option.path}
                    href={option.path}
                    aria-label={option.key}
                    startContent={option.icon}
                    style={{ margin: "2px 0" }}
                    className={currentSegment.path === option.path ? "bg-default" : ""}
                    onPress={() => setIsMenuOpen(false)}
                  >
                    {option.label}
                  </ListboxItem>
                ))}
            </ListboxSection>
          ))}
        </Listbox>
      </NavbarMenu>
    </Navbar>
  );
}

