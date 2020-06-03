    var db;

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

    //제이쿼리를 사용한다.
    $(document).ready(function(){
    //로그인버튼 눌렀을 때
      $(document).on('click','.submit_btn',function(){

        var email = $('#user_name').val();
        var password = $('#user_password').val();

        var user = db.collection('User').doc(email);
        user.get().then(function(doc){
            var Data = doc.data();
            var dbPassword = Data.password;
            if(doc.exists){
                if(password==dbPassword){
                    alert('login 성공!');
                    sessionStorage.setItem('userid', email);
                    window.location.href="main.html";
                }
                else{
                alert("password를 잘 못 입력하셨습니다.");
                }
            }else{
            alert("login 정보가 올바르지 않습니다.");
            }
        }).catch(function(error){
            alert("login 정보를 다시 한번 확인해 주세요!");
            console.log("Error getting document:", error);
        });
      });
    });