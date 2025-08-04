import { Dispatch, SetStateAction, useEffect, useMemo } from "react";
import {
  User,
  Listbox,
  ListboxSection,
  ListboxItem,
  Button,
  Skeleton
} from "@heroui/react";
import { useLocation } from "react-router-dom";
import { UserActions } from "./UserActions";
import { useLogout } from "../hooks/useLogout";
import { truncateText } from "@/utils/stringUtils";
import { LeftToBracketIcon } from "@/assets/icons";

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

export default function Sidebar ({ setTitle, menuOptions, changePasswordModal }: SidebarProps) {
  const { pathname } = useLocation();
  const { handleLogout, loading, user } = useLogout();

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
    <aside className="p-[.5rem] fixed h-[100vh] w-[175px] z-[30] bg-[hsl(0,0%,0%)]" >
      <UserActions
        triggerComponent={
          <User
            className="cursor-pointer w-full"
            name={
              user?.fullName
                ? truncateText(user?.fullName ?? "", 20, "truncateWithEllipsis")
                : <Skeleton className="w-[110px] h-[18px] my-[1px] rounded-sm" />
            }
            description={
              user?.fullName
                ? truncateText(user?.role.name + (user?.specialty ? ` - ${user.specialty.name}` : ""), 20, "truncateLastWord")
                : <Skeleton className="w-[110px] h-[14px] my-[1px] rounded-sm" />
            }
            avatarProps={{
              showFallback: true,
              src: "./favicon.ico",
              radius: "none",
              classNames: {
                base: "bg-transparent !h-[30px] !w-[30px] ml-2",
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
                >
                  {option.label}
                </ListboxItem>
              ))}
          </ListboxSection>
        ))}
      </Listbox>

      <div className="absolute bottom-0 pb-5 flex">
        <Button
          variant="ghost"
          onPress={handleLogout}
          isLoading={loading}
          startContent={
            !loading && <LeftToBracketIcon />
          }
        >
            Cerrar sesión
        </Button>
      </div>
    </aside>
  );
}
