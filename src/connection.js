const sql = require('mssql');

let con_config = (id) => {
    switch(id) {
        case 1:
        case '1':
            return {
                user: 'Admin',
                password: 'abc123',
                server: "DESKTOP-97R9KGM\\MAYCHU", // You can use 'localhost\\instance' to connect to named instance
                database: 'CSDLPT',
                trustServerCertificate: true
            }
        case 2:
        case '2':
            return {
                user: 'Phong1',
                password: 'abc123',
                server: "DESKTOP-97R9KGM\\TRAM1", // You can use 'localhost\\instance' to connect to named instance
                database: 'CSDLPT',
                trustServerCertificate: true
            }
        case 3:
        case '3':
            return {
                user: 'Phong2',
                password: 'abc123',
                server: "DESKTOP-97R9KGM\\TRAM2", // You can use 'localhost\\instance' to connect to named instance
                database: 'CSDLPT',
                trustServerCertificate: true
            }
        case 4:
        case '4':
            return {
                user: 'Phong3',
                password: 'abc123',
                server: "DESKTOP-97R9KGM\\TRAM3", // You can use 'localhost\\instance' to connect to named instance
                database: 'CSDLPT',
                trustServerCertificate: true
            }
    }
}


// connection = async () => {
//     sql.connect(con_config).then(() => {
//         return sql.query`select * from users`
//     }).then(result => {
//         console.dir(result)
//     }).catch(err => {
//         console.log(err)
//     })
// }

// connection()


module.exports = con_config;