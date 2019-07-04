export const constants = {
    NumFormat: "0,0",
    DateFormat: "DD/MM/YYYY",
    DateTimeFormat: "DD/MM/YYYY HH:mm",
    DateTimeFormatFromDB: "YYYY-MM-DD HH:mm:ss",
    DatePickerFormat: "DD/MM/YYYY",
    DateFormatFromDB: "YYYY-MM-DD",
    TimeFormat: "HH:mm",
    MinDateDefault: "0001-01-01 00:00:00",
    MinDateDefaultISOFormat: "0001-01-01T00:00:00",
    EmptyGuidId: '00000000-0000-0000-0000-000000000000',
    ErrorDefinedPrefix: "Error Defined: ",
    ForeignKey: "foreign",
    EmailExsits: "taken",
    DuplicateEntry: "duplicate",
    Slash: '/',
    LastTimeAPICalled: "MICE_LastedTimeCallAPI",
    AuthenKey: "mice",
    Email: "email",
    CurrentUserName: "MICE_CurrentUserName",
    CurrentUserId: "MICE_CurrentUserId",
    DefaultPathName: "MICE_DefaultPathName",
    AccessibleProperties: "MICE_AccessibleProperties",
    TokenExpiration: "MICE_TokenExpiration",
    ValidTo: "MICE_ValidTo",
    IsRoleAllowChangeSIC: "MICE_IsRoleAllowChangeSIC",
    ReturnUrl: "MICE_ReturnUrl",
    ReturnUrlId: "MICE_ReturnUrlId",
    ErrorTimeRefreshToken: 30000,
    TimeToDirectToLoginPage: 5000,
    ImageFileAccept: ".gif,.jpg,.jpeg,.png",
    Permissions: {
        View: 1,
        Insert: 2,
        Update: 3,
        Delete: 4
    },
    ActionGridItemWidth: 49,
    routes : [
        {
            "route": "dashboard",
            "permissions": [
                1
            ],
            "routes": []
        },
        {
            "route": "reports",
            "permissions": [],
            "routes": [
                {
                    "route": "report-mice-booking-by-status",
                    "permissions": [
                        1
                    ],
                    "routes": []
                },
                {
                    "route": "report-mice-revenue-by-component",
                    "permissions": [
                        1
                    ],
                    "routes": []
                },
                {
                    "route": "report-booking-and-revenue-by-sales-man",
                    "permissions": [
                        1
                    ],
                    "routes": []
                },
                {
                    "route": "report-booking-and-revenue-by-industry",
                    "permissions": [
                        1
                    ],
                    "routes": []
                },
                {
                    "route": "guest-room-type-calendar",
                    "permissions": [
                        1
                    ],
                    "routes": []
                }
            ]
        },
        {
            "route": "sales-management",
            "permissions": [],
            "routes": [
                {
                    "route": "venue-calendar",
                    "permissions": [
                        1,
                        2,
                        3,
                        4
                    ],
                    "routes": []
                },
                {
                    "route": "booking-list-management",
                    "permissions": [
                        1,
                        2,
                        3,
                        4
                    ],
                    "routes": []
                },
                {
                    "route": "create-booking",
                    "permissions": [
                        2
                    ],
                    "routes": []
                }
            ]
        },
        {
            "route": "service-management",
            "permissions": [],
            "routes": [
                {
                    "route": "service-list",
                    "permissions": [
                        1,
                        2,
                        3,
                        4
                    ],
                    "routes": []
                },
                {
                    "route": "create-service",
                    "permissions": [
                        2
                    ],
                    "routes": []
                }
            ]
        },
        {
            "route": "account-management",
            "permissions": [],
            "routes": [
                {
                    "route": "account-list",
                    "permissions": [
                        1,
                        2,
                        3,
                        4
                    ],
                    "routes": []
                },
                {
                    "route": "create-account",
                    "permissions": [
                        2
                    ],
                    "routes": []
                }
            ]
        },
        {
            "route": "settings",
            "permissions": [],
            "routes": [
                {
                    "route": "property-list",
                    "permissions": [
                        1,
                        2,
                        3,
                        4
                    ],
                    "routes": []
                },
                {
                    "route": "venue-list",
                    "permissions": [
                        1,
                        2,
                        3,
                        4
                    ],
                    "routes": []
                },
                {
                    "route": "highlight",
                    "permissions": [
                        1,
                        2,
                        3,
                        4
                    ],
                    "routes": []
                },
                {
                    "route": "maintenance",
                    "permissions": [
                        1,
                        2,
                        3,
                        4
                    ],
                    "routes": []
                },
                {
                    "route": "service-category-list",
                    "permissions": [
                        1,
                        2,
                        3,
                        4
                    ],
                    "routes": []
                },
                {
                    "route": "industry-list",
                    "permissions": [
                        1,
                        2,
                        3,
                        4
                    ],
                    "routes": []
                },
                {
                    "route": "area-list",
                    "permissions": [
                        1,
                        2,
                        3,
                        4
                    ],
                    "routes": []
                },
                {
                    "route": "chain-list",
                    "permissions": [
                        1,
                        2,
                        3,
                        4
                    ],
                    "routes": []
                },
                {
                    "route": "venue-setup-list",
                    "permissions": [
                        1,
                        2,
                        3,
                        4
                    ],
                    "routes": []
                },
                {
                    "route": "event-type",
                    "permissions": [
                        1,
                        2,
                        3,
                        4
                    ],
                    "routes": []
                },
                {
                    "route": "contact-role",
                    "permissions": [
                        1,
                        2,
                        3,
                        4
                    ],
                    "routes": []
                },
                {
                    "route": "sales-area",
                    "permissions": [
                        1,
                        2,
                        3,
                        4
                    ],
                    "routes": []
                },
                {
                    "route": "lead-source",
                    "permissions": [
                        1,
                        2,
                        3,
                        4
                    ],
                    "routes": []
                }
            ]
        },
        {
            "route": "user-management",
            "permissions": [],
            "routes": [
                {
                    "route": "user-list",
                    "permissions": [
                        1,
                        2,
                        3,
                        4
                    ],
                    "routes": []
                },
                {
                    "route": "role-list",
                    "permissions": [
                        1,
                        2,
                        3,
                        4
                    ],
                    "routes": []
                }
            ]
        }
    ],
};