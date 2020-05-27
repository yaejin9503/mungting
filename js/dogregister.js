  var db;
  var url; //사진이 저장될 url


   /* $(document).on('click','.elseTypeButton',function(){
        jQuery('#dogType option:selected').val($('#elseType').val());
    })
    $(document).on('click','.elseTypeButton',function(){
            jQuery('#catType option:selected').val($('#elseType').val());
        })
    */
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

         jQuery('#Type').change(function(){
             var state = jQuery('#Type option:selected').val();
             if(state == '강아지'){
                 jQuery('.TypeSelect-2').show();
                 jQuery('.TypeSelect-3').hide();
                 jQuery('.layer').hide();
             }else if(state == '고양이'){
                 jQuery('.TypeSelect-3').show();
                 jQuery('.TypeSelect-2').hide();
                 jQuery('.layer').hide();
             }else{
                 jQuery('.TypeSelect-2').hide();
                 jQuery('.TypeSelect-3').hide();
                 jQuery('.layer').hide();
             }
         })
         jQuery('#dogType').change(function() {
             var state = jQuery('#dogType option:selected').val();
             if ( state == '기타') {
                 jQuery('.layer').show();
             } else {
                 jQuery('.layer').hide();
             }
         });
         jQuery('#catType').change(function() {
             var state = jQuery('#catType option:selected').val();
             if ( state == '기타') {
                 jQuery('.layer').show();
              } else{
                 jQuery('.layer').hide();
              }
          });

        $(document).on('click','.register',function(){
        jQuery('#dogType option:selected').val($('#elseType').val());
        jQuery('#catType option:selected').val($('#elseType').val());

           var today = new Date();

           var hours = today.getHours(); // 시
           var minutes = today.getMinutes();  // 분
           var seconds = today.getSeconds();  // 초
           var milliseconds = today.getMilliseconds(); // 밀리초

           var time = hours + ':' + minutes + ':' + seconds + ':' + milliseconds;

           var email = sessionStorage.getItem('userid');
           var location = $('#location').val();
           var phoneNum = $('#phoneNum').val();
           var color = $('#color').val();
           var feature = $('#feature').val();
           var gender = $('#gender').val();
           var dogAge = $('#dogAge').val();
           var dogType = $('#dogType').val();
           var catType = $('#catType').val();
           var type = $('#Type').val();


           var state = jQuery('#Type option:selected').val();
           if(state=='미정'){
                alert("동물 타입을 선택해 주세요");
                return false;
           }

           var fileButton = document.getElementById('file');
           var file = fileButton.files[0];
           console.log(file);
           //현재 유저 키를 파일이름으로 지정
           var storageRef = firebase.storage().ref('images/'+ time);
           console.log(storageRef);
           var task = storageRef.put(file);

           //여기에서 파이어베이스 스토리지에도 저장하고, 데이터베이스에도 저장해줘야 함.
           //유저키(부모키)를 레퍼런스로 잡고 url 추가해줌 userSessionCheck()먼저 실행
           //사진을 업데이트 하고 다시 불러온다.
           //비동기 방식으로 움직임

           task.then(function(snapshot){
                url = snapshot.downloadURL;
                console.log("파이어베이스 스토리즈에 저장된 주소= " + url);
                //파이어베이스에 이미지를 저장한 수 그 url을 가져와서 img태그에 적용해줌
              //  document.querySelector('#myimage').src = url;

                //여기에 user 레퍼런스에 사진 url을 저장
                //선택된 키가 있으면 수정

                db.collection("dogInfo").add({
                    imgURL : url,
                    location : location,
                    phoneNum : phoneNum,
                    color : color,
                    feature : feature,
                    gender : gender,
                    type : type,
                    dogType : dogType,
                    catType : catType,
                    dogAge : dogAge,
                    email : email
                })
                .then(function(docRef){
                    console.log("Document written with Id",docRef.id);
                })
                alert("성공적으로 변경 되었습니다.");
                window.location.href="main.html";
           }).catch(function(error){
                alert("다시 입력 해 주세요!  ");
                console.log("Error getting document:", error);
               });
           });
        });