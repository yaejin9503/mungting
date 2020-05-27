

 var url; //사진이 저장될 url


function validate() {
    var re = /^[a-zA-Z0-9]{4,12}$/;
    var re2 = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    // 이메일이 적합한지 검사할 정규식
   
    var pw = document.getElementById("password");
    var pw2 = document.getElementById("checkpw");
    var email = document.getElementById("email");
    var join1 = document.getElementById("join1");
    // var num1 = document.getElementById("num1");
    // var num2 = document.getElementById("num2");

    var arrNum1 = new Array(); // 주민번호 앞자리숫자 6개를 담을 배열
    var arrNum2 = new Array(); // 주민번호 뒷자리숫자 7개를 담을 배열

    // ------------ 이메일 까지 -----------
    if(!check(re,pw,"패스워드는 4~12자의 영문 대소문자와 숫자로만 입력")) {
        return false;
    }

    if(pw.value != pw2.value) {
        alert("비밀번호가 다릅니다. 다시 확인해 주세요.");
        pw.value = "";
        pw2.value = "";
        pw.focus();
        return false;
    }

    if(email.value=="") {
        alert("이메일을 입력해 주세요");
        email.focus();
        return false;
    }

    if(!check(re2, email, "적합하지 않은 이메일 형식입니다.")) {
        return false;
    }

    if(join.name.value=="") {
        alert("이름을 입력해 주세요");
        join.name.focus();
        return false;
    }

    insertFireDB()
}

function insertFireDB(){
    let email = $('#email').val();
    let password = $('#password').val(); 
    let name = $('#name').val();

    console.log(email);
    console.log(password);
    console.log(name);
    
    // 파이어베이스에 업로드
    //let data = {};
    //updateuserfiredb('test@gmail.com', data);
    writeregisterfiredb(email,name,password);
}

function check(re, what, message) {
    if(re.test(what.value)) {
        return true;
    }
    alert(message);
    what.value = "";
    what.focus();
    //return false;
}

// collection에 문서 만들기 함수 (예시)
const writeregisterfiredb = (docname, name, pw) => {

    let docRef = firedb.collection('User').doc(docname);
    docRef.set({
       // email: em,
        username: name,
        password: pw
    }).catch((err) => {
        console.log('Error');
        return false;
    });

    alert("회원가입이 완료되었습니다.");
};

$(document).ready(() => {

    $(document).on('click', '#mypagecancel', () => {
        $('.selected_spices').html('<span class="span_selected">믹스<span class="span_close">&times;</span></span>');
        $('#animals input').attr('data-cacheval', 'true');
    });

});
