const Firestore = require('@google-cloud/firestore');

const getUserbyIDHandler = (request, h) => {
    const {
        userId,
    } = request.payload;

    const userRef = db.collection('users').doc(userId);
    const doc = await userRef.get();

    if (!doc.exists) {
        const respon = h.response({
            status: 'fail',
            message: 'data user tidak ditemukan',
          });
          respon.code(500);
          return respon;

    }
    const respon = h.response({
        status: 'success',
        data: doc.data(),
      });
    respon.code(201);
    return respon;
  };

  const addUserHandler = (request, h) => {
    const {
        userId,
        username,
    } = request.payload;
    
    const data = {
        username: username,
        history: {},
      };
    
    const res = await db.collection('users').doc(userId).set(data);

      if (res) {
        const respon = h.response({
          status: 'success',
          message: 'data user berhasil ditambahkan',
          data: {
            userId: userId,
          },
        });
        respon.code(201);
        return respon;
      }
    const respon = h.response({
        status: 'fail',
        message: 'data user gagal ditambahkan',
      });
    respon.code(500);
    return respon;
    
  };


module.exports = {
    getUserbyIDHandler,
    addUserHandler,
  };