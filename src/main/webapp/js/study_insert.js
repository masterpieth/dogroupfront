$(function() {
    //-- 과목 정보 받아오기 START --
    $.ajax({
        url: backURL + 'study/subject/list/',
        success: function(jsonObj) {
            let str =''
            $.each(jsonObj, function(index, item) {
                if(index % 5 == 0) {
                    str += '<br>'
                }
                str += '&nbsp;<input type="checkbox" name="subject" value="' + item.subjectCode + '"><span> ' + item.subjectName +' </span>'
            })
            $('div.study_subject').append(str)
            $('input[name=email]').val(localStorage.getItem('loginedId'))
        }, error: function(xhr) {
            alert(xhr.status)
        }
    })
    //-- 과목 정보 받아오기 END --

    //-- 스터디 개설버튼 클릭 START --
    $('#open_study_btn').click(() => {
        $('form').submit()
        return false
    })
    //-- 스터디 개설버튼 클릭 END --

    //-- 스터디 개설 START --
    $('form').submit(() => {
        let formData = new FormData($('form')[0])
        $.ajax({
            xhrFields: {
                withCredentials: true,
            },
            url: backURL + 'study/',
            method: 'post',
            data: formData,
            processData: false,
            contentType: false,
            success: function() {
                console.log('aaa')
            }, error: function(xhr) {
                alert(xhr.status)
            }
        })
        return false
    })
    //-- 스터디 개설 END --
})