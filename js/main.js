
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
let count_comment = 1; // 홈페이지가 로드 될 때 마다 전체 댓글의 수를 가져와 댓글으 인덱스를 지정해 준다.


const readfiredb = (colname) => {
    let tagList = '';
    firedb.collection(colname)
        .get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                tagList += '<article class="contents">'
                tagList += '<header class="top">'
                tagList += '<div class="user_container">'
                tagList += '<div class="user_name">'
                tagList += '<div class="nick_name m_text">'+doc.data().type+'</div>'
                tagList += '<div class="country s_text">'+doc.data().location+'</div>'
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
                tagList += '<a href ="#comment_'+doc.data().index+'"><div class="sprite_bubble_icon"></div></a>'
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
                tagList += '<a href="javacsript:void(0);" class ="slice_comment" onclick="comment_slice('+doc.data().index+');"><div class="root1">&nbsp;댓글보기</a>';
                tagList += '<div class="comment_area_'+doc.data().index+'"style="display: none">'
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
    comment_delete_Displaybutton(userId);
});


const heart = (index) => { // index를 넘겨 받음
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
const pad = (number, length) => {
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
        comment : user_comment,
        comment_index : count_comment
    };
    firedb.collection("dogInfo").doc(new_index).update(data).then(function(){
        console.log("Document successfully update!!");
        $("#comment_"+index).val('');
        $("#comment_"+index).attr( 'placeholder', '댓글 달기..' );
        comment_view();
        count_comment = 1; //comment_count에 있던 값을 초기화 해줌
        comment_delete_Displaybutton(userId);
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
                var document_index = doc.data().index;
                for (var i =0; i<obj_arrs.length;i++) {
                    tagList += '<div class="user_comment">'
                    tagList +='<div id="timer_'+doc.data().index+'" style=" display: inline;">'+obj_arrs[i].userid+' : '+obj_arrs[i].comment+'</div><div class ="delete_inline">'
                    tagList +='<div class="delete_'+obj_arrs[i].comment_index+'" style="display:none";>';
                    tagList += '<a href="javacsript:void(0);" class ="delete_icon" onClick="comment_delete('+obj_arrs[i].comment_index+','+document_index+');"><div class="delete1"></div></a></div></div></div>'
                    count_comment+=1; //전체 댓글의 개수를 알아보기 위함
                }
                $('.comment_area_'+doc.data().index).html(tagList);
                tagList ='';
            });
        });
}
//댓글 삭제
// 1. user 본인인지 확인한다. o
// 2. 본인이 아니라면 x표시는 안하게 하고 o
// 3. 본인이 맞다면 화면에 x를 표시한다. o
// 4. 화면에 x가 표시되면 해당 댓글 인덱스를 찾아서 실제 데이터를 지우고
// 5. 화면상에 다시 업데이트 될 수 있도록 댓글창 함수를 불러온다.
const comment_delete_Displaybutton = (userId) => {
    let tagList = '';
    firedb.collection("dogInfo")
        .get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                var obj_arrs = Object.values(doc.data().comment);
                //문서 1일 때의 댓글의 length 인디..
                for (var i =0; i<obj_arrs.length;i++) {
                    if(obj_arrs[i].userid != userId){//비교가 잘 이루어 짐 아이디가 같을 때
                        $(".delete_"+obj_arrs[i].comment_index).css("display","none");
                    }else{
                        $(".delete_"+obj_arrs[i].comment_index).css("display","block");
                    }
                }
            })
    })


}
const comment_delete = (comment_index, document_index) => {
    var comment_index = comment_index.toString();
    var document_index = document_index.toString();
    var userId = sessionStorage.getItem('userid');


    var dogInfoRef = firedb.collection('dogInfo').doc(document_index);

    // 해당하는 value값을 찾는건 select 문으로 찾고 delete는 밑에 값으로 하쟈
    // Remove the 'capital' field from the document
    var removeCapital = dogInfoRef.update({
        capital: firebase.firestore.FieldValue.delete()
        // capital 자리에 댓글을 등록한 시간을 넣어둔 key값을 가져와야 함.

    });


    firedb.collection("dogInfo")
        .get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                var obj_arrs = Object.values(doc.data().comment);
                //문서 1일 때의 댓글의 length 인디..
                for (var i =0; i<obj_arrs.length;i++) {
                    if(obj_arrs[i].userid != userId){// 내 아이디 일 때만

                    }else{

                    }
                }
            })
        })
}

//commnet view 슬라이드 하는 함수
const comment_slice = (index) =>{
    var submenu = $(".comment_area_"+index);
    if (submenu.is(":visible")){
        submenu.slideUp();
    }else{
        submenu.slideDown();
    }
}







