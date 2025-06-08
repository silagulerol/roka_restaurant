module.exports = {
    privGropus: [
        {
            id:"USERS", 
            name: "User Permissions"
        },
        {
            id:"ROLES", 
            name: "Role Permissions"
        },
        {
            id:"MENUITEMS", 
            name: "MenuItems Permissions"
        },
        {
            id:"RESERVATIONS", 
            name: "Reservations Permissions"
        },
        {
            id:"ORDERS", 
            name: "Orders Permissions"
        },
        {
            id:"AUDITLOGS", 
            name: "AuditLogs Permissions"
        }
    ],
    privileges : [
        {
            key:"user_view",
            name:"User View",
            group:"USERS",
            description:"User view"
        },
         {
            key:"user_add",
            name:"User Add",
            group:"USERS",
            description:"User add"
        },
         {
            key:"user_update",
            name:"User Update",
            group:"USERS",
            description:"User update"
        },
         {
            key:"user_delete",
            name:"User Delete",
            group:"USERS",
            description:"User delete"
        },

        {
            key:"role_view",
            name:"Role View",
            group:"ROLES",
            description:"Role view"
        },
         {
            key:"role_add",
            name:"Role Add",
            group:"ROLES",
            description:"Role add"
        },
         {
            key:"role_update",
            name:"Role Update",
            group:"ROLES",
            description:"Role update"
        },
         {
            key:"role_delete",
            name:"Role Delete",
            group:"ROLES",
            description:"Role delete"
        },

        {
            key:"menuitems_view",
            name:"MenuItems View",
            group:"MENUITEMS",
            description:"MenuItems view"
        },
        {
            key:"menuitems_add",
            name:"MenuItems Add",
            group:"MENUITEMS",
            description:"MenuItems add"
        },
        {
            key:"menuitems_update",
            name:"MenuItems Update",
            group:"MENUITEMS",
            description:"MenuItems update"
        },
        {
            key:"menuitems_delete",
            name:"MenuItems Delete",
            group:"MENUITEMS",
            description:"MenuItems delete"
        },
        {
            key:"menuitems_export",
            name:"MenuItems Export",
            group:"MENUITEMS",
            description:"MenuItems export"
        },
        {
            key:"reservations_view",
            name:"Reservations View",
            group:"RESERVATIONS",
            description:"Reservations view"
        },
        {
            key:"reservations_add",
            name:"Reservations Add",
            group:"RESERVATIONS",
            description:"Reservations add"
        },
        {
            key:"reservations_update",
            name:"Reservations Update",
            group:"RESERVATIONS",
            description:"Reservations update"
        },
        {
            key:"reservations_delete",
            name:"Reservations Delete",
            group:"RESERVATIONS",
            description:"Reservations delete"
        },
        {
            key:"reservations_export",
            name:"Reservations Export",
            group:"RESERVATIONS",
            description:"Reservations export"
        },
        {
            key:"orders_view",
            name:"Orders View",
            group:"ORDERS",
            description:"Orders view"
        },
        {
            key:"orders_add",
            name:"Orders Add",
            group:"ORDERS",
            description:"Orders add"
        },
        {
            key:"orders_update",
            name:"Orders Update",
            group:"ORDERS",
            description:"Orders update"
        },
        {
            key:"orders_delete",
            name:"Orders Delete",
            group:"ORDERS",
            description:"Orders delete"
        },
        {
            key:"orders_export",
            name:"Orders Export",
            group:"ORDERS",
            description:"Orders export"
        },
        {
            key:"auditlogs_view",
            name:"AuditLogs View",
            group:"AUDITLOGS",
            description:"AuditLogs view"
        }
        
    ]

    
}