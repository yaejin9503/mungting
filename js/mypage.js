$(document).ready(() => {

    let testid = "test@gmail.com";
    let userinfo;

    const initializemypage = (data) => {
        userinfo = data;
        for (const a of userinfo.animal) {
            $('#'+a+'input').trigger('click');
        }
        $('.selected_spices').empty();
        for (const a of userinfo.spices) {
            let elem = '<span class="span_selected">'+a+'<span class="span_close">&times;</span></span>';
            $('.selected_spices').append(elem);
        }
    };

    /* 처음 페이지 진입했을 때 사용자 정보에 등록되어 있는 원하는 반려동물 반영하여 보여줌 */
    $(document).on(readfiredoc('User', testid, initializemypage));

    /* 클릭한 animal 버튼에 맞게 spices에서 option 변경 */
    $(document).on('click', '', () => {

    });

    $(document).on('change', '#spices', () => {
        // if 이미 있으면 또 추가하면 안됨! <- 기능 추가 필요
        let elem = $('#spices option:selected').val();
        elem = '<span class="span_selected">'+elem+'<span class="span_close">&times;</span></span>';
        $('.selected_spices').append(elem);
    });

    $(document).on('click', '#mypagecancel', () => {
        $('.selected_spices').html('<span class="span_selected">믹스<span class="span_close">&times;</span></span>');
        $('#animals input').attr('data-cacheval', 'true');
    });

    $(document).on('click', '.span_close', (event) => {
        console.log(event);
        console.log(this);
        $(event.target).parent('.span_selected').remove();
    });

    $('.span_close').on('click', function(){
        console.log(this);
    });

    $(document).on('click', '#mypagesave', () => {
        // 파이어베이스에 업로드
        let data = {};
        updateuserfiredb('test@gmail.com', data);
    });
});