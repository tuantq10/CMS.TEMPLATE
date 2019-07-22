export const endpoint = {
    //auth
    auth: 'user/login',
    profile: 'user/profile',
    logout: "user/logout",
    refreshToken: "user/refresh",

    //user-management
    role: 'role',
    user: 'user',

    service: 'services',
    chainsNewType: 'chains',
    propertiesDdl: 'properties/ddl',
    chainsDll: 'chains/ddl',
    locationsDdl: 'locations/ddl',
    serviceCategoryDdl: 'categories/ddl',
    propertiesDdlByChainOrLocation: 'properties/ddl-by-chain-location',
    serviceCategory: 'categories',
    property: 'properties',


    //language
    language:"language",
    
    //uoloadFile
    createSession:"uploadfile/create",
    uploadFileChuck:"uploadfile/upload/session/",
    donwloadFileChuck:"uploadfile/download",
    uploadFileChuckAzure:"uploadfile/uploadazure/session/",
    uploadFileAzureCompleted:"uploadfile/uploadAzure/complete",

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
