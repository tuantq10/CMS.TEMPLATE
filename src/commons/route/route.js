export const routes = [
    {
        "route": "dashboard",
        "permissions": [1],
    },
    {
        "route": "reports",
        "permissions": [1],
        "routes": [
            {
                "route": "report-mice-booking-by-status",
                "permissions": [1],
                "routes": []
            },
            {
                "route": "report-mice-revenue-by-component",
                "permissions": [1],
                "routes": []
            },
            {
                "route": "report-booking-and-revenue-by-sales-man",
                "permissions": [1],
                "routes": []
            },
            {
                "route": "report-booking-and-revenue-by-industry",
                "permissions": [1],
                "routes": []
            },
            {
                "route": "guest-room-type-calendar",
                "permissions": [1],
                "routes": []
            }
        ]
    },
    {
        "route": "sales-management",
        "permissions": [1],
        "routes": [
            {
                "route": "venue-calendar",
                "permissions": [1, 2, 3, 4],
                "routes": []
            },
            {
                "route": "booking-list-management",
                "permissions": [1, 2, 3, 4],
                "routes": []
            },
            {
                "route": "create-booking",
                "permissions": [2],
                "routes": []
            }
        ]
    },
    {
        "route": "service-management",
        "permissions": [1],
        "routes": [
            {
                "route": "service-list",
                "permissions": [1, 2, 3, 4],
                "routes": []
            },
            {
                "route": "create-service",
                "permissions": [2],
                "routes": []
            }
        ]
    },
    {
        "route": "account-management",
        "permissions": [1],
        "routes": [
            {
                "route": "account-list",
                "permissions": [1, 2, 3, 4],
                "routes": []
            },
            {
                "route": "create-account",
                "permissions": [2],
                "routes": []
            }
        ]
    },
    {
        "route": "settings",
        "permissions": [1],
        "routes": [
            {
                "route": "property-list",
                "permissions": [1, 2, 3, 4],
                "routes": []
            },
            {
                "route": "venue-list",
                "permissions": [1, 2, 3, 4],
                "routes": []
            },
            {
                "route": "highlight",
                "permissions": [1, 2, 3, 4],
                "routes": []
            },
            {
                "route": "maintenance",
                "permissions": [1, 2, 3, 4],
                "routes": []
            },
            {
                "route": "service-category-list",
                "permissions": [1, 2, 3, 4],
                "routes": []
            },
            {
                "route": "industry-list",
                "permissions": [1, 2, 3, 4],
                "routes": []
            },
            {
                "route": "area-list",
                "permissions": [1, 2, 3, 4],
                "routes": []
            },
            {
                "route": "chain-list",
                "permissions": [1, 2, 3, 4],
                "routes": []
            },
            {
                "route": "venue-setup-list",
                "permissions": [1, 2, 3, 4],
                "routes": []
            },
            {
                "route": "event-type",
                "permissions": [1, 2, 3, 4],
                "routes": []
            },
            {
                "route": "contact-role",
                "permissions": [1, 2, 3, 4],
                "routes": []
            },
            {
                "route": "sales-area",
                "permissions": [1, 2, 3, 4],
                "routes": []
            },
            {
                "route": "lead-source",
                "permissions": [1, 2, 3, 4],
                "routes": []
            }
        ]
    },
    {
        "route": "user-management",
        "permissions": [1],
        "routes": [
            {
                "route": "users",
                "permissions": [1, 2, 3, 4],
                "routes": []
            },
            {
                "route": "roles",
                "permissions": [1, 2, 3, 4],
                "routes": []
            }
        ]
    }
];