//import { v4 as uuidv4 } from 'uuid'; // Importar uuid para generar IDs únicos

import { v4 as uuidv4 } from 'uuid';

const databaseCollections = {
    users: {
        schema: {
            keyCompression: false, // set this to true, to enable the keyCompression
            version: 0,
            title: 'Usuarios',
            primaryKey: 'id',
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    maxLength: 100, // <- the primary key must have set maxLength,
                    //default: uuidv4()
                },
                firstName: {
                    type: 'string'
                },
                lastName: {
                    type: 'string'
                },
                username: {
                    type: 'string'
                }
            },
            required: [
                'id'
            ]
        }
    }
}

//export { MyDatabaseSchemas }


const databasesConfig = [
    {
        dbName: 'database',
        collections: databaseCollections,
    },
];


export { databasesConfig }