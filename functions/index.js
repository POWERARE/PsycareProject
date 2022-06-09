const functions = require("firebase-functions");
const admin = require("firebase-admin");

//Admin SDK configuration
var serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://psycare-app-bangkit-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const express = require("express");
const tf = require("@tensorflow/tfjs");
const cors = require("cors");
const { response } = require("express");
const app = express();
const db = admin.firestore();

// cors
app.use( cors( { origin:true } ) );

// routes
app.get('/api', (req, res) => {
    return res.status(200).send({
        status: 'ok',
        msg: 'berhasil',
        data: 'PSYCARE APP'
    });
});

// users

    // adduser
app.post('/api/users', (req, res) => {

    (async () => {

        try
        {
            await db.collection('users').doc(req.body.userId)
            .create({
                username: req.body.username,
                favourite: [],
            })

            return res.status(200).send({
                status: 'ok',
                msg: 'berhasil',
                data: []
            });
        }
        catch (error)
        {
            console.log(error);
            return res.status(500).send({
                status: 'failed',
                msg: error.message,
                data: []
            });
        }

    })();

});

    // edituser
app.put('/api/users/:userId', (req, res) => {

    (async () => {

        try
        {
            const document = db.collection('users').doc(req.params.userId);

            await document.update({
                username: req.body.username
            })
            let user = await document.get();
            let response = user.data();

            return res.status(200).send({
                status: 'ok',
                msg: 'berhasil',
                data: response
            });
        }
        catch (error)
        {
            console.log(error);
            return res.status(500).send({
                status: 'failed',
                msg: error.message,
                data: []
            });
        }

    })();
    
});

    // getuser
app.get('/api/users/:userId', (req, res) => {

    (async () => {

        try
        {
            const document = db.collection('users').doc(req.params.userId);
            let user = await document.get();
            let response = user.data();

            return res.status(200).send({
                status: 'ok',
                msg: 'berhasil',
                data: response
            });
        }
        catch (error)
        {
            console.log(error);
            return res.status(500).send({
                status: 'failed',
                msg: error.message,
                data: []
            });
        }

    })();
    
});

    // addfav
app.post('/api/users/fav/:userId', (req, res) => {

    (async () => {

        try
        {
            const favref = db.collection('users').doc(req.params.userId);
            const doc = await favref.get();
            let fav = doc.data().favourite;

            if(!fav.includes(req.body.discussionId)){
                fav.push(req.body.discussionId);
                await favref.update({favourite: fav});
            }

            return res.status(200).send({
                status: 'ok',
                msg: 'berhasil',
                data: {favourite: fav}
            });
        }
        catch (error)
        {
            console.log(error);
            return res.status(500).send({
                status: 'failed',
                msg: error.message,
                data: []
            });
        }

    })();
    
});

    // delfav
app.delete('/api/users/fav/:userId', (req, res) => {

    (async () => {

        try
        {
            const favref = db.collection('users').doc(req.params.userId);
            const doc = await favref.get();
            let fav = doc.data().favourite;

            if(fav.includes(req.body.discussionId)){
                fav = fav.filter(item => item !== req.body.discussionId)
                
                await favref.update({favourite: fav});
            }

            return res.status(200).send({
                status: 'ok',
                msg: 'berhasil',
                data: {favourite: fav}
            });
        }
        catch (error)
        {
            console.log(error);
            return res.status(500).send({
                status: 'failed',
                msg: error.message,
                data: []
            });
        }

    })();
    
});

    // gethistory
app.get('/api/users/histories/:userId', (req, res) => {

    (async () => {

        try
        {
            let query = db.collection('users').doc(req.params.userId).collection('histories');
            let result = [];

            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs;

                for (let doc of docs)
                {
                    const selectedItem = {
                        historyId: doc.id,
                        hasil: doc.data().hasil,
                        date: doc.data().date
                    }
                    result.push(selectedItem);
                }
                return result;
            }); 
            return res.status(200).send({
                status: 'ok',
                msg: 'berhasil',
                data: result
            });
        }
        catch (error)
        {
            console.log(error);
            return res.status(500).send({
                status: 'failed',
                msg: error.message,
                data: []
            });
        }
    })();
});

// discussion

    // adddisc
app.post('/api/discussions', (req, res) => {

    (async () => {

        try
        {
            let waktu = new Date().toISOString();
            await db.collection('discussions').add({
                id_creator: req.body.id_creator,
                nickname: req.body.nickname,
                isi: req.body.isi,
                date: waktu
            });

            return res.status(200).send({
                status: 'ok',
                msg: 'berhasil',
                data: []
            });
        }
        catch (error)
        {
            console.log(error);
            return res.status(500).send({
                status: 'failed',
                msg: error.message,
                data: []
            });
        }

    })();

});

    // addreply
app.post('/api/discussions/reply/:discussionId', (req, res) => {

    (async () => {

        try
        {
            let waktu = new Date().toISOString();
            await db.collection('discussions').doc(req.params.discussionId)
            .collection('reply').add({
                id_creator: req.body.id_creator,
                nickname: req.body.nickname,
                isi: req.body.isi,
                date: waktu
            });

            return res.status(200).send({
                status: 'ok',
                msg: 'berhasil',
                data: []
            });
        }
        catch (error)
        {
            console.log(error);
            return res.status(500).send({
                status: 'failed',
                msg: error.message,
                data: []
            });
        }

    })();

});

    // getalldisc
app.get('/api/discussions', (req, res) => {
    (async () => {
        try
        {
            let query = db.collection('discussions');
            let result = [];

            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs;

                for (let doc of docs)
                {
                    const selectedItem = {
                        discussionId: doc.id,
                        id_creator: doc.data().id_creator,
                        nickname: doc.data().nickname,
                        isi: doc.data().isi,
                        date: doc.data().data
                    }
                    result.push(selectedItem);
                }
                return result;
            }); 
            return res.status(200).send({
                status: 'ok',
                msg: 'berhasil',
                data: result
            });
        }
        catch (error)
        {
            console.log(error);
            return res.status(500).send({
                status: 'failed',
                msg: error.message,
                data: []
            });
        }
    })();
});

    // getallreply
app.get('/api/discussions/reply/:discussionId', (req, res) => {

    (async () => {

        try
        {
            let query = db.collection('discussions').doc(req.params.discussionId).collection('reply');
            let result = [];

            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs;

                for (let doc of docs)
                {
                    const selectedItem = {
                        replyId: doc.id,
                        id_creator: doc.data().id_creator,
                        nickname: doc.data().nickname,
                        isi: doc.data().isi,
                        date: doc.data().data
                    }
                    result.push(selectedItem);
                }
                return result;
            }); 
            return res.status(200).send({
                status: 'ok',
                msg: 'berhasil',
                data: result
            });
        }
        catch (error)
        {
            console.log(error);
            return res.status(500).send({
                status: 'failed',
                msg: error.message,
                data: []
            });
        }
    })();
});

// psikolog

    // getpsikolog
app.get('/api/psikolog', (req, res) => {
    (async () => {
        try
        {
            let query = db.collection('psikolog');
            let result = [];

            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs;

                for (let doc of docs)
                {
                    const selectedItem = {
                        psikologId: doc.id,
                        name: doc.data().name,
                        lat: doc.data().lat,
                        long: doc.data().long,
                        contact: doc.data().contact,
                        expertise: doc.data().expertise
                    }
                    result.push(selectedItem);
                }
                return result;
            }); 
            return res.status(200).send({
                status: 'ok',
                msg: 'berhasil',
                data: result
            });
        }
        catch (error)
        {
            console.log(error);
            return res.status(500).send({
                status: 'failed',
                msg: error.message,
                data: []
            });
        }
    })();
});

// quisionnaire

    // predict
app.post('/api/predict/:userId', (req, res) => {

    (async () => {

        try
        {
            let data = req.body.data;
            let waktu = new Date().toISOString();
            let explanationStress, recommendationsStress, explanationDepresi,
            recommendationsDepresi, explanationAnxiety, recommendationsAnxiety,
            result, Stresstreatments, Depresitreatments, Anxietytreatments,
            severityStress, severityDepresi, severityAnxiety;

            // predict
            let hasil = await predict(data);
            let hasil0 = indexOfMax(hasil[0]);
            let hasil1 = indexOfMax(hasil[1]);
            let hasil2 = indexOfMax(hasil[2]);

            // add history
            await db.collection('users').doc(req.params.userId)
            .collection('histories')
            .add({
              date: waktu,
              hasil: {
                  stress: hasil0,
                  depresi: hasil1,
                  anxiety: hasil2
              },
            });

            //treatments
            let StresstreatmentsRef = db.collection('results').doc('stress').collection('treatments');
            switch(hasil0){
                case 0:
                    Stresstreatments = await StresstreatmentsRef.doc('normal').get();
                    result = Stresstreatment.data();
                    severityStress = result.severity;
                    explanationStress = result.explanation;
                    recommendationsStress = result.recommendations;
                    break;
                case 1:
                    Stresstreatments = await StresstreatmentsRef.doc('moderate').get();
                    result = Stresstreatments.data();
                    severityStress = result.severity;
                    explanationStress = result.explanation;
                    recommendationsStress = result.recommendations;
                    break;
                case 2:
                    Stresstreatments = await StresstreatmentsRef.doc('severe').get();
                    result = Stresstreatments.data();
                    severityStress = result.severity;
                    explanationStress = result.explanation;
                    recommendationsStress = result.recommendations;
                    break;
            }
            let DepresitreatmentsRef = db.collection('results').doc('depression').collection('treatments');
            switch(hasil1){
                case 0:
                    Depresitreatments = await DepresitreatmentsRef.doc('normal').get();
                    result = Depresitreatments.data();
                    severityDepresi = result.severity;
                    explanationDepresi = result.explanation;
                    recommendationsDepresi = result.recommendations;
                    break;
                case 1:
                    Depresitreatments = await DepresitreatmentsRef.doc('moderate').get();
                    result = Depresitreatments.data();
                    severityDepresi = result.severity;
                    explanationDepresi = result.explanation;
                    recommendationsDepresi = result.recommendations;
                    break;
                case 2:
                    Depresitreatments = await DepresitreatmentsRef.doc('severe').get();
                    result = Depresitreatments.data();
                    severityDepresi = result.severity;
                    explanationDepresi = result.explanation;
                    recommendationsDepresi = result.recommendations;
                    break;
            }
            let AnxietytreatmentsRef = db.collection('results').doc('anxiety').collection('treatments');
            switch(hasil1){
                case 0:
                    Anxietytreatments = await AnxietytreatmentsRef.doc('normal').get();
                    result = Anxietytreatments.data();
                    severityAnxiety = result.severity;
                    explanationAnxiety = result.explanation;
                    recommendationsAnxiety = result.recommendations;
                    break;
                case 1:
                    Anxietytreatments = await AnxietytreatmentsRef.doc('moderate').get();
                    result = Anxietytreatments.data();
                    severityAnxiety = result.severity;
                    explanationAnxiety = result.explanation;
                    recommendationsAnxiety = result.recommendations;
                    break;
                case 2:
                    Anxietytreatments = await AnxietytreatmentsRef.doc('severe').get();
                    result = Anxietytreatments.data();
                    severityAnxiety = result.severity;
                    explanationAnxiety = result.explanation;
                    recommendationsAnxiety = result.recommendations;
                    break;
            }

            // response
            return res.status(200).send({
              status: 'ok',
              msg: 'berhasil',
              data: [{
              hasilStress: severityStress,
              explanationStress: explanationStress,
              recommendationsStress: recommendationsStress,
              hasilDepresi: severityDepresi,
              explanationDepresi: explanationDepresi,
              recommendationsDepresi: recommendationsDepresi,
              hasilAnxiety: severityAnxiety,
              explanationAnxiety: explanationAnxiety,
              recommendationsAnxiety: recommendationsAnxiety
              }]
            });
        }
        catch (error)
        {
            console.log(error);
            return res.status(500).send({
                status: 'failed',
                msg: error.message,
                data: []
            });
        }

    })();

});

async function predict(data) {
    let modelStress = await tf.loadLayersModel(
      "https://storage.googleapis.com/dummy_model_psycare-app-bangkit/Model_PsyCare_dummy-real/model_depresi/model.json"
    );
    let modelDepresi = await tf.loadLayersModel(
        "https://storage.googleapis.com/dummy_model_psycare-app-bangkit/Model_PsyCare_dummy-real/model_depresi/model.json"
      );
    let modelAnxiety = await tf.loadLayersModel(
        "https://storage.googleapis.com/dummy_model_psycare-app-bangkit/Model_PsyCare_dummy-real/model_depresi/model.json"
      );
    let dataStress = [data[0], data[5], data[7], data[10], data[11], data[13], data[17], data[21], data[26], data[28], data[31], data[31], data[34], data[38]];
    let inputStress = tf.tensor1d(dataStress);
    inputStress = inputStress.expandDims(0);
    let predStress = modelStress.predict(inputStress).dataSync();

    let dataDepresi = [data[1], data[3], data[6], data[8], data[14], data[18], data[19], data[22], data[24], data[27], data[29], data[35], data[39], data[40]];
    let inputDepresi = tf.tensor1d(dataDepresi);
    inputDepresi = inputDepresi.expandDims(0);
    let predDepresi = modelDepresi.predict(inputDepresi).dataSync();

    let dataAnxiety = [data[2], data[4], data[9], data[12], data[15], data[16], data[20], data[23], data[25], data[30], data[33], data[36], data[37], data[41]];
    let inputAnxiety = tf.tensor1d(dataAnxiety);
    inputAnxiety = inputAnxiety.expandDims(0);
    let predAnxiety = modelAnxiety.predict(inputAnxiety).dataSync();

    hasil = [predStress, predDepresi, predAnxiety];
    return hasil;
  }

function indexOfMax(arr){
    if (arr.length === 0) {
        return -1;
    }
    var max = arr[0];
    var maxIndex = 0;
    for (var i = 1; i < arr.length; i++){
        if (arr[i] > max) {
            maxIndex = i; max = arr[i];
        }
    }
    return maxIndex;
}

exports.app = functions.https.onRequest(app);
