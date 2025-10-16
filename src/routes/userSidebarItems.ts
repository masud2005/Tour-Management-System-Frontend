import Bookings from "@/pages/user/Bookings";

export const userSidebarItems = [
    {
        title: "History",
        items: [
            {
                title: "Bookings",
                url: "/user/bookings",
                component: Bookings
            }
        ],
    }
]