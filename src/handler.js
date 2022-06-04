const Firestore = require('@google-cloud/firestore');

const db = new Firestore({
  projectId: '[id project gcp]',
  keyFilename: 'service-account.json', //generated key buat service account
});

//User
const getUserbyIDHandler = (request, h) => {
    const { userId } = request.params;

    const userRef = db
    .collection('users').doc(userId);
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
  }

const addUserHandler = (request, h) => {
    const {
        userId,
        username,
    } = request.payload;
    
    const data = {
        username: username,
        favorite: []
      };
    
    const res = await db
    .collection('users').doc(userId).set(data);

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
    
  }


//Questionnaire
const QuestionnaireHandler = (request, h) => {

    //inisiasi variables
    const {
      userId,
      jawaban,
    } = request.payload;
    let input_anxiety = ExtractInputs(jawaban, "0");
    let input_depresi = ExtractInputs(jawaban, "1");
    let input_stress = ExtractInputs(jawaban, "2");
    let hasil_anxiety;
    let hasil_depresi;
    let hasil_stress;
    const waktu =  new Date().toISOString();
    const modelUrl_anxiety = "https://storage.googleapis.com/dummy_model_psycare-app-bangkit/Model_PsyCare_dummy-real/model_anxiety.h5" //https://storage.googleapis.com/dummy_model_psycare-app-bangkit/Model_PsyCare_dummy-real/model_anxiety.json
    const modelUrl_depresi = "https://storage.googleapis.com/dummy_model_psycare-app-bangkit/Model_PsyCare_dummy-real/model_depression.h5" //https://storage.googleapis.com/dummy_model_psycare-app-bangkit/Model_PsyCare_dummy-real/model_depression.json
    const modelUrl_stress = "https://storage.googleapis.com/dummy_model_psycare-app-bangkit/Model_PsyCare_dummy-real/model_stress.h5" //https://storage.googleapis.com/dummy_model_psycare-app-bangkit/Model_PsyCare_dummy-real/model_stress.json

    //ml


    //masukkan data history ke database
    const res = await db
    .collection('users').doc(userId)
    .collection("history").add({  //id kuesioner di auto generate firestore
      kuesionerId: IdKuesioner,
      date: waktu,
      hasil: hasil
    });

    //respon
    if (res) {
      const respon = h.response({
        status: 'success',
        message: 'data hasil kuesioner berhasil ditambahkan',
        data: {
          hasil: hasil,
        },
      });
      respon.code(201);
      return respon;
    }

  const respon = h.response({
      status: 'fail',
      message: 'data hasil kuesioner gagal ditambahkan',
    });
  respon.code(500);
  return respon;

}


//Discussion
const addDiscussionHandler = (request, h) => {
  //inisiasi variables
  const {
    userId,
    title,
    isi,
  } = request.payload;
  const waktu =  new Date().toISOString();

  //masukkan data ke database
  const res = await db
  .collection('diskusi').add({
    id_creator: userId,
    title: title,
    isi: isi,
    date: waktu,
    reply: {},
  });

  //mengambil nilai id diskusi yang digenerate firestore
  const discussionId = res.id;

  //respon
  if (res) {
      const respon = h.response({
        status: 'success',
        message: 'data diskusi berhasil ditambahkan',
        data: {
          discussionId: discussionId,
        },
      });
      respon.code(201);
      return respon;
  }
  const respon = h.response({
      status: 'fail',
      message: 'data diskusi gagal ditambahkan',
    });
  respon.code(500);
  return respon;

}

const addReplyHandler = (request, h) => {
  //inisiasi variables
  const { discussionId } = request.params;
  const {
    userId,
    isi,
  } = request.payload;
  const waktu =  new Date().toISOString();

  //masukkan data ke database
  const res = await db
  .collection('diskusi').doc(discussionId)
  .collection('reply').add({
    id_user: userId,
    isi: isi,
    date: waktu,
  });

  //mengambil nilai id diskusi yang digenerate firestore
  const replyId = res.id;

  //respon
  if (res) {
    const respon = h.response({
      status: 'success',
      message: 'data reply berhasil ditambahkan',
      data: {
        replyId: replyId,
      },
    });
    respon.code(201);
    return respon;
  }
  const respon = h.response({
      status: 'fail',
      message: 'data reply gagal ditambahkan',
    });
  respon.code(500);
  return respon;

}

const getallDiscussionHandler = (request, h) => {
  var data = {};
  const Ref = db.collection('diskusi');
  const snapshot = await Ref.select('id_creator', 'title', 'description', 'date').get();
  snapshot.forEach(doc => {
    data.push({
      discussionId: doc.id,
      diskusi: doc.data()
    })
  });

  const respon = h.response({
    status: 'success',
    data: data,
  });
  respon.code(201);
  return respon;

}

const getDiscussionbyIDHandler = (request, h) => {
  const { discussionId } = request.params;

  const Ref = db.collection('diskusi').doc(discussionId);
  const doc = await Ref.get();

  if (!doc.exists) {
    const respon = h.response({
      status: 'fail',
      message: 'data diskusi tidak ditemukan',
    });
    respon.code(500);
    return respon;

  } else {
    const respon = h.response({
      status: 'success',
      data: doc.data(),
    });
    respon.code(201);
    return respon;
  }

}

const getDiscussionbyuserIDHandler = (request, h) => {
  const { userId } = request.params;

  const Ref = db.collection('diskusi').where('id_creator', '==', userId).get();
  const doc = await Ref.get();

  if (!doc.exists) {
    const respon = h.response({
      status: 'fail',
      message: 'data diskusi tidak ditemukan',
    });
    respon.code(500);
    return respon;

  } else {
    const respon = h.response({
      status: 'success',
      data: doc.data(),
    });
    respon.code(201);
    return respon;
  }

}

const getPsikologHandler = (request, h) => {
  var data = {};
  const Ref = db.collection('psikolog');
  const snapshot = await Ref.get();
  snapshot.forEach(doc => {
    data.push({
      psikologId: doc.id,
      diskusi: doc.data()
    })
  });

  const respon = h.response({
    status: 'success',
    data: data,
  });
  respon.code(201);
  return respon;

}

const getHistoryHandler = (request, h) => {
  const { userId } = request.params;

  const userRef = db
  .collection('users')
  .doc(userId)
  .collection('history');
  const doc = await userRef.get();

  if (!doc.exists) {
      const respon = h.response({
          status: 'fail',
          message: 'data history tidak ditemukan',
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
}

//extras
const ExtractInputs = (input, type) => {
  let arr;
  const index_anxiety = [2,4,9,12,15,16,20,23,25,30,33,36,37,41];
  const index_depresi = [1,3,6,8,14,18,19,22,24,27,29,35,39,40];
  const index_stress = [0,5,7,10,11,13,17,21,26,28,31,32,34,38];

  switch(type) {
    case "0":
      arr = index_anxiety;
      break;
    case "1":
      arr = index_depresi;
      break;
    case "2":
      arr = index_stress;
      break;
    default:
      return
  }

  let output = [input[arr[0]], input[arr[1]], input[arr[2]], input[arr[3]], input[arr[4]], input[arr[5]], input[arr[6]], input[arr[7]], input[arr[8]], input[arr[9]], input[arr[10]], input[arr[11]],];
  
  return output;
}

module.exports = {
    getUserbyIDHandler,
    addUserHandler,
    QuestionnaireHandler,
    addDiscussionHandler,
    addReplyHandler,
    getallDiscussionHandler,
    getDiscussionbyIDHandler,
    getDiscussionbyuserIDHandler,
    getPsikologHandler,
    getHistoryHandler,
  };
