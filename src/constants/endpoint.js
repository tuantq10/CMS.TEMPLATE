export const endpoint = {
    //auth
    auth: 'auth/token',
    profile: 'auth/profiles',
    logout: "auth/logout",
    capCha: "auth/recaptcha",
    refreshToken: "auth/refresh-token",

    //menu
    accessibleMenu: 'menus/accessible',

    service: 'services',
    chainsNewType: 'chains',
    propertiesDdl: 'properties/ddl',
    chainsDll: 'chains/ddl',
    locationsDdl: 'locations/ddl',
    serviceCategoryDdl: 'categories/ddl',
    propertiesDdlByChainOrLocation: 'properties/ddl-by-chain-location',
    serviceCategory: 'categories',
    property: 'properties',

    ddl: {
        sic: "ddl/sic",
        sicMultiSelect: "ddl/sic-multiselect",
        industries: "ddl/industries",
        salesAreas: "ddl/sales-areas",
        contactRoles: "ddl/contact-roles",
        leadSources: "ddl/lead-sources",
        accounts: "ddl/accounts",
        contacts: "ddl/accounts/{accountId}/contacts",
        eventTypes: "eventtypes/ddl",
        properties: 'properties/ddl',
        venues: 'venues/ddl/{propertyId}',
        setuplistByVenue: 'setuplists/ddl/{venueId}',
        categoryByProperty: 'properties/{propertyId}/ddl-categories',
        serviceBycategories: 'categories/{propertyId}/{categoryId}/ddl-services'
    },
};
