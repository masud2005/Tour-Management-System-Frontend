import AddTour from "@/pages/admin/AddTour";
import ManageTourType from "@/pages/admin/ManageTourType";
// import Analytics from "@/pages/admin/Analytics";
import { lazy } from "react";

const Analytics = lazy(() => import("@/pages/admin/Analytics"))

export const adminSidebarItems = [
    {
        title: "Dashboard",
        items: [
            {
                title: "Analytics",
                url: "/admin/analytics",
                component: Analytics
            },
            {
                title: "Add Tour",
                url: "/admin/add-tour",
                component: AddTour
            },
        ],
    },
    {
        title: "Tour Management",
        items: [
            {
                title: "Manage Tour",
                url: "/admin/manage-tour",
                component: AddTour
            },
            {
                title: "Manage Tour Type",
                url: "/admin/manage-tour-type",
                component: ManageTourType
            },
        ],
    }
]