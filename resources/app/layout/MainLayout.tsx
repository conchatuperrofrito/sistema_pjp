import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { useState, useEffect } from "react";

import {
  UserIcon,
  HospitalUserIcon,
  CalendarIcon,
  CalendarUsersIcon,
  GaugeIcon,
  TriangleExclamationIcon,
  ClipboardListCheckIcon,
  StethoscopeIcon,
  HelmetSafetyIcon,
  CircleExclamationIcon,
  FilesIcon
} from "@/assets/icons";
import { useMediaQuery } from "react-responsive";
import MobileNavbar from "@/components/MobileNavbar";
import clsx from "clsx";
import { ChangePasswordModal } from "@/components/ChangePasswordModal";
import { useDisclosure } from "@heroui/react";
import { useAuthStore } from "@/store/authStore";

const MENU_OPTIONS = [
  {
    section: "Módulo Principal",
    options: [
      {
        path: "/dashboard",
        label: "Dashboard",
        key: "dashboard",
        icon: <GaugeIcon />,
        permission: [__ADMIN_ROLE_ID__, __DOCTOR_ROLE_ID__],
        title: "Dashboard"
      },
      {
        path: "/usuarios",
        label: "Usuarios",
        key: "users",
        icon: <UserIcon />,
        permission: [__ADMIN_ROLE_ID__],
        title: "Gestión de Usuarios"
      },
      {
        path: "/pacientes",
        label: "Pacientes",
        key: "patients",
        icon: <HospitalUserIcon />,
        permission: [__ADMIN_ROLE_ID__, __DOCTOR_ROLE_ID__],
        title: "Gestión de Pacientes"
      },
      {
        path: "/citas",
        label: "Citas",
        key: "appointments",
        icon: <CalendarUsersIcon />,
        permission: [__ADMIN_ROLE_ID__, __DOCTOR_ROLE_ID__],
        title: "Gestión de Citas"
      }
    ]
  },
  {
    section: "Seguridad y Salud (SST)",
    options: [
      {
        path: "/eventos",
        label: "Eventos",
        key: "events",
        icon: <CalendarIcon />,
        permission: [__ADMIN_ROLE_ID__, __DOCTOR_ROLE_ID__],
        title: "Registro de Capacitaciones, Entrenamientos y Simulacros"
      },
      {
        path: "/accidentes",
        label: "Accidentes",
        key: "accidents",
        icon: <TriangleExclamationIcon />,
        permission: [__ADMIN_ROLE_ID__, __DOCTOR_ROLE_ID__],
        title: "Registro de Accidentes de Trabajo, Enfermedades Ocupacionales e Incidentes Peligrosos"
      },
      {
        path: "/inspecciones",
        label: "Inspecciones",
        key: "inspections",
        icon: <ClipboardListCheckIcon />,
        permission: [__ADMIN_ROLE_ID__, __DOCTOR_ROLE_ID__],
        title: "Registro de Inspecciones Internas de Seguridad y Salud en el Trabajo"
      },
      {
        path: "/examenes-ocupacionales",
        label: "Exámenes Oc.",
        key: "occupational-exams",
        icon: <StethoscopeIcon />,
        permission: [__ADMIN_ROLE_ID__, __DOCTOR_ROLE_ID__],
        title: "Registro de Exámenes Médicos Ocupacionales"
      },
      {
        path: "/entregas-epp",
        label: "Entregas EPP",
        key: "epp-deliveries",
        icon: <HelmetSafetyIcon />,
        permission: [__ADMIN_ROLE_ID__, __DOCTOR_ROLE_ID__],
        title: "Registro de Entrega de Equipos de Protección Personal (EPP)"
      },
      {
        path: "/monitoreos-ambientales",
        label: "Monitoreos",
        key: "environmental-monitorings",
        icon: <CircleExclamationIcon />,
        permission: [__ADMIN_ROLE_ID__, __DOCTOR_ROLE_ID__],
        title: "Registro de Monitoreos Ambientales y Agentes de Riesgo"
      },
      {
        path: "/actas-comite",
        label: "Actas Comité",
        key: "committee-minutes",
        icon: <FilesIcon />,
        permission: [__ADMIN_ROLE_ID__, __DOCTOR_ROLE_ID__],
        title: "Registro de Actas del Comité de SST"
      }
    ]
  }
];


export default function MainLayout () {
  const { fetchUser } = useAuthStore();
  const [title, setTitle] = useState<string>("---");
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const changePasswordModal = useDisclosure();

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      <ChangePasswordModal
        isOpen={changePasswordModal.isOpen}
        onOpenChange={changePasswordModal.onOpenChange}
      />

      {isMobile &&
      <MobileNavbar
        setTitle={setTitle}
        menuOptions={MENU_OPTIONS}
        changePasswordModal={changePasswordModal.onOpenChange}
      />
      }
      <div className="flex">
        {!isMobile && (
          <Sidebar
            setTitle={setTitle}
            menuOptions={MENU_OPTIONS}
            changePasswordModal={changePasswordModal.onOpenChange}
          />
        )}
        <main className={clsx("p-[.5rem] w-full",{
          "ml-[175px] pr-3 pt-4": !isMobile
        })}>
          <header className="md:pb-4 pb-2 w-auto">
            <h1 className="font-semibold">
              {title}
            </h1>
          </header>
          <Outlet />
        </main>
      </div>
    </>
  );
}
