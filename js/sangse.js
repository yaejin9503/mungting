var db;

 let firebaseConfig = {
        apiKey: "AIzaSyAYmlBlP11V7dqKADGOqjMi7KCG4SPhJz8",
        authDomain: "dogmatchapp-6baa6.firebaseapp.com",
        databaseURL: "https://dogmatchapp-6baa6.firebaseio.com",
        projectId: "dogmatchapp-6baa6",
        storageBucket: "dogmatchapp-6baa6.appspot.com",
        messagingSenderId: "881707155237",
        appId: "1:881707155237:web:52a6a2c31ec167c01ae4cc"
    };
    // Initialize Firebase
var app = firebase.initializeApp(firebaseConfig);
//firebase.firestore(app).settings( { timestampsInSnapshots: true })
firedb = firebase.firestore(app);

$(document).ready(() => {
     userId = sessionStorage.getItem('userid');
     console.log('firedb', firedb);
     let tagList;

     firedb.collection("dogInfo").where("number", "==", "1")
         .get()
         .then(function(querySnapshot) {
             querySnapshot.forEach(function(doc) {
                 tagList += '<p><img src="'+doc.data().imgURL+'"></p>'
                 tagList += '<p>종류 : '+doc.data().type+'</p>'
                 tagList += '<p>성별 : '+doc.data().gender+'</p>'
                 tagList += '<p>위치 : '+doc.data().location+'</p>'
                 tagList += '<p>특징 : '+doc.data().feature+'</p>'
                 tagList += '<p>연락처 : '+doc.data().email+'</p>'
             });
             $('.anInfo').html(tagList);
         })
         .catch(function(error) {
             console.log("Error getting documents: ", error);
         });
  })


