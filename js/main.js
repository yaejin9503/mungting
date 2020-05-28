
let firebaseConfig = {
    apiKey: "AIzaSyAYmlBlP11V7dqKADGOqjMi7KCG4SPhJz8",
    authDomain: "dogmatchapp-6baa6.firebaseapp.com",
    databaseURL: "https://dogmatchapp-6baa6.firebaseio.com",
    projectId: "dogmatchapp-6baa6",
    storageBucket: "dogmatchapp-6baa6.appspot.com",
    messagingSenderId: "881707155237",
    appId: "1:881707155237:web:52a6a2c31ec167c01ae4cc"
};
firebase.initializeApp(firebaseConfig);

let firedb = firebase.firestore();
var likeList = [];
var indexList = new Array();

const readfiredb = (colname) => {
    let tagList = '';
    firedb.collection(colname)
        .get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                tagList += '<article class="contents">'
                tagList += '<header class="top">'
                tagList += '<div class="user_container">'
                tagList += '<div class="profile_img">'
                //tagList += '<img src="imgs/thumb.jpeg" alt="프로필이미지">'
                tagList += '</div>'
                tagList += '<div class="user_name">'
                tagList += '<div class="nick_name m_text">'+doc.data().type+'</div>'
                tagList += '<div class="country s_text">'+doc.data().gender+'</div>'
                tagList += '</div>'
                tagList += '</div>'
                tagList += '<div class="sprite_more_icon" data-name="more">'
                tagList += '<ul class="toggle_box">'
                tagList += '<li><input type="submit" class="follow" value="팔로우" data-name="follow"></li>'
                tagList += '<li>수정</li>'
                tagList += '<li>삭제</li>'
                tagList += '</ul>'
                tagList += '</div>'
                tagList += '</header>'
                tagList += '<div class="img_section">'
                tagList += '<div class="trans_inner">'
                tagList += '<div><img src="'+doc.data().imgURL+'" alt="visual01" ></div>'
                tagList += '</div>'
                tagList += '</div>'
                tagList += '<div class="bottom_icons">'
                tagList += '<div class="left_icons">'
                tagList += '<div class="heart_btn">'
                tagList += '<a href="javacsript:void(0);" onClick="heart('+doc.data().index+');"><div id ="heart_'+doc.data().index+'"class="sprite_heart_icon_outline" name="39" data-name="heartbeat">'
                tagList += '</div></a></div>'
                tagList += '<div class="sprite_bubble_icon"></div>'
                tagList += '</div>'
                tagList += '<div class="right_icon">'
                tagList += '<div class="sprite_bookmark_outline" data-name="bookmark"></div>'
                tagList += '</div>'
                tagList += '</div>'
                tagList += '<div class="likes m_text">'
                tagList += '좋아요'
                tagList += '<span id="like-count-39_'+doc.data().index+'">'+doc.data().like+'</span>'
                tagList += ' 개'
                tagList += '</div>'
                tagList += '<div class="comment_container">'
                tagList += '<div class="comment" id="comment-list-ajax-post37">'
                tagList += '<div class="comment-detail">'
                tagList += '<div class="nick_name m_text">'+doc.data().userid+'</div>'
                tagList += '<div>'+doc.data().feature+'</div>'
                tagList += '</div>'
                tagList += '</div>'
                //tagList += '<div class="small_heart">'
                //tagList += '<div class="sprite_small_heart_icon_outline"></div>'
                //tagList += '</div>'
                tagList += '</div>'
                tagList += '<div class="comment_area_'+doc.data().index+'">'
                tagList += '</div>'
                tagList += '<div class="comment_field" id="add-comment-post37">'
                tagList += '<input type="text" id ="comment_'+doc.data().index+'" placeholder="댓글달기...">'
                tagList += '<a href="javacsript:void(0);" onClick="comment_map_write('+doc.data().index+');"><div class="upload_btn m_text" data-name="comment">게시</div></a>'
                tagList += '</div>'
                tagList += '</article>'

             });
            $('.contents_box').html(tagList);
        }).catch((err) => {
            console.log('Error getting documents', err);
    });

};


$(document).ready(() => {
    userId = sessionStorage.getItem('userid');
    var i =0;
    readfiredb('dogInfo');
    confirm_list(userId);
    comment_view();
    $('#spreadBtn04').click(function(){
        if($("#hiddenList03").is(":visible")){
            $("#spreadBtn04").toggleClass("icon-down-dir");
            $("#hiddenList03").slideUp();
        }else{
            $("#spreadBtn04").toggleClass("icon-down-dir");
            $("#hiddenList03").slideDown();
        }
    });



    //comment_map_read();
});


function heart(index){ // index를 넘겨 받음
    userId = sessionStorage.getItem('userid');
    firedb.collection("dogInfo").where("index","==",index).get()
        .then(function(querySnapshot){
            querySnapshot.forEach(function(doc) {
                // like_list에 있는 숫자 일 경우에는 좋아요 취소 후 like_list에서 해당 데이터 삭제
                // like_list에 없는 숫자 일 경우에는 좋아요 누른 후 like_list에 해당 데이터 추가
                for(var i=0; i<likeList.length;i++){
                    if(likeList[i] == index){ // likelist에 있는 숫자일 경우
                        heartList_out(index,userId)
                        likeList[i] = 0;
                        $('#heart_'+ doc.data().index).css({
                            'background': 'url("imgs/background01.png") no-repeat -52px -261px'})
                        mylike = doc.data().like
                        minus_heart = mylike -1
                        document.getElementById("like-count-39_"+index).innerHTML = minus_heart+""
                        heart_minus(mylike,index)
                        console.log(likeList)
                        break;
                    }else{ // Likelist에 없는 숫자일 경우
                        heartList_in(index,userId) //내가 좋아한 리스트에 해당 index를 추가해줌
                        $('#heart_'+ doc.data().index).css({
                            'background': 'url("imgs/background01.png") no-repeat -26px -261px'})
                        mylike = doc.data().like // db에서 like의 수를 가져와서
                        like = mylike+1 //1을 늘려준뒤
                        document.getElementById("like-count-39_"+index).innerHTML = like+"" //해당 텍스트를 수정해줌
                        heart_update(mylike, index) // 실제 데이터도 업데이트 해줌
                        confirm_list(userId)
                        console.log(likeList)
                    }
                }

            });
        }).catch(function(error) {
        console.log("Error getting documents: ", error);
    });
}

const heart_update = (mylike,index) =>{ // 실제 like 데이터에 1을 더해주는 함수
    var new_index = index.toString() //숫자인 index의 값을 문자열로 바꿔줌
    var docRef = firedb.collection("dogInfo").doc(new_index) //해당 인덱스 문서로 진입
    return docRef.update({
        like: mylike+1 //실제 데이터 like의 값을 1 증가해줌
    }).then(function() {
        console.log("Document successfully updated!");
    }).catch(function(error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });
};

const heart_minus = (mylike,index) =>{ // 실제 like 데이터에서 1을 빼주는 함수
    var new_index = index.toString()
    var docRef = firedb.collection("dogInfo").doc(new_index)
    return docRef.update({
        like: mylike-1
    }).then(function() {
        console.log("Document successfully updated!");
    }).catch(function(error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });
};


const confirm_list = (userid) =>{ //like_list에 있는 인덱스를 확인해서 좋아했던 인덱스는 하트로 표시해둠
    var docRef = firedb.collection("User").doc(userid);

    docRef.get().then(function(doc) {
        if (doc.exists) {
            console.log("Document data:", doc.data().like_list)
            for(var i=0; i<doc.data().like_list.length;i++){
                likeList[i] = (doc.data().like_list[i])
            }
            console.log(likeList)
            for(var i=0;i<likeList.length;i++) { //list에 해당 값이 있으면 화면을 로드했을 때부터 표시
                $('#heart_' + likeList[i]).css({
                    'background': 'url("imgs/background01.png") no-repeat -26px -261px'
                })
            }
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
};


// 좋아요를 누르면 like_list에 해당 index가 추가 된다.
const heartList_in = (index,userId) =>{
    userId = sessionStorage.getItem('userid');
    var docRef = firedb.collection("User").doc(userId);

// like_list에서 해당 인덱스 추가
    docRef.update({
        like_list:firebase.firestore.FieldValue._arrayUnion(index)
    })
}

// 좋아요를 취소하면 like_list에서 해당 글의 인덱스가 삭제 된다.
const heartList_out = (index,userId) =>{
    userId = sessionStorage.getItem('userid');
    var docRef = firedb.collection("User").doc(userId);

// like_list에서 해당 인덱스 삭제
    docRef.update({
        like_list: firebase.firestore.FieldValue._arrayRemove(index)
    })
}

//날짜, 시간, 분 ,초 받아서 두자리로 만들어 주는 함수
function pad(number, length){
    var str = number.toString();
    while(str.length < length) {
        str = '0' + str;
    }
    return str;
}

//댓글 처리 - 댓글 쓰기
const comment_map_write = (index) => {
    user_comment = $("#comment_"+index).val()
    new_index = index.toString()
    userId = sessionStorage.getItem('userid');
    //comment의 갯수를 가져ㅇ오는 함수 안에서 밑 함수가 또 돌게 됨.
    // 사용자가 둘 일때는 데이터가 수정되어서

    // dynamic key data
    var data = new Object();
    var d = new Date();
    var Year = d.getFullYear().toString();
    var Month = pad(d.getMonth()+1,2);
    var Day = pad(d.getDate(),2);
    var Hour = pad(d.getHours(),2);
    var Min = pad(d.getMinutes(),2);
    var Sec = pad(d.getSeconds(), 2);
    var nowDay = Year + Month + Day + Hour + Min + Sec + d.getMilliseconds();
    var key = 'comment.'+nowDay;
    console.log(key);

    //json 키 값 다이나믹 값으로 하는 방법
    data[key] = {
        userid : userId,
        comment : user_comment
    };
    firedb.collection("dogInfo").doc(new_index).update(data).then(function(){
        console.log("Document successfully update!!");
        $("#comment_"+index).val('');
        $("#comment_"+index).attr( 'placeholder', '댓글 달기..' );
        comment_view();

    })
}

//댓글 처리 - 화면에 보이기
// 해당 인덱스 (문서) 안에 있는 comment 데이터에 접근 해야함 !
// 컬럼 값이 지금 시간 보다 낮은 댓글 한개를 뽑아 내야 함..

const comment_view=() =>{
    let tagList = '';
    firedb.collection('dogInfo')
        .get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                var obj_arrs = Object.values(doc.data().comment);
                for (var i =0; i<obj_arrs.length;i++) {
                tagList += '<div class="user_comment"><div id="timer_'+doc.data().index+'">'+obj_arrs[i].userid+' : '+obj_arrs[i].comment+'</div></div>'
                }
                $('.comment_area_'+doc.data().index).html(tagList)
                tagList ='';
            });

        });
}
function fn_spread(id){
    var getID = document.getElementById(id);
    getID.style.display=(getID.style.display=='block') ? 'none' : 'block';
}






