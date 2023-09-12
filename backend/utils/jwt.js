const jwt = require('jsonwebtoken');

const generarJWT = (id_user) => {
    return new Promise((resolve, reject) => {
        const payload = {
            id_user,
        };

        jwt.sign(
            payload,
            process.env.JWT_ACCESS_SECRET,
            {
                expiresIn: '4h',
            },
            (err, token) => {
                if (err) {
                    console.log(err);
                    reject('No se genero el token');
                } else {
                    resolve(token);
                }
            }
        );
    });
};

module.exports = {
    generarJWT,
};