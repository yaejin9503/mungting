var db;
var url; //사진이 저장될 url

// Your web app's Firebase configuration
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

db = firebase.firestore(app);
firebaseDatabase = firebase.database();


$(document).ready(function(){

    var index = 1;

    db.collection("dogInfo").get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                index += 1;
            })
        })

    $(document).on('click','.submit_btn',function(){
        console.log("들어오긴 하나? ")
        var today = new Date();

        var hours = today.getHours(); // 시
        var minutes = today.getMinutes();  // 분
        var seconds = today.getSeconds();  // 초
        var milliseconds = today.getMilliseconds(); // 밀리초

        var time = hours + ':' + minutes + ':' + seconds + ':' + milliseconds;

        var email = sessionStorage.getItem('userid');
        var location = $('#location').val();
        var feature = $('#feature').val();
        var gender = $('#gender').val();
        var type = $('#type').val();


        var fileButton = document.getElementById('id_photo');
        var file = fileButton.files[0];
        console.log(file);
        //현재 유저 키를 파일이름으로 지정
        var storageRef = firebase.storage().ref('images/'+ time);
        console.log(storageRef);
        var task = storageRef.put(file);

        //여기에서 파이어베이스 스토리지에도 저장하고, 데이터베이스에도 저장해줘야 함.
        //사진을 업데이트 하고 다시 불러온다.
        //비동기 방식으로 움직임

        task.then(function(snapshot){
            url = snapshot.downloadURL;
            console.log("파이어베이스 스토리즈에 저장된 주소= " + url);
            //파이어베이스에 이미지를 저장한 수 그 url을 가져와서 img태그에 적용해줌
            //  document.querySelector('#myimage').src = url;
            //여기에 user 레퍼런스에 사진 url을 저장
            //선택된 키가 있으면 수정
            //문서 번호 지정 index값으로 지정하고 colum index에도 값을 할당 해야함.

            var new_index = index.toString();

            db.collection("dogInfo").doc(new_index).set({
                imgURL : url,
                location : location,
                feature : feature,
                gender : gender,
                type : type,
                email : email,
                like : 0,
                index : index
            })
            .then(function(docRef){
                console.log("Document written with Id",docRef);
                alert("성공적으로 변경 되었습니다.");
                window.location.href="main.html";
            })
        }).catch(function(error){
            alert("다시 입력 해 주세요!  ");
            console.log("Error getting document:", error);
        });
    });
});