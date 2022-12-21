$(function() {
    showMenu()

    let password

    //-- 사용자 정보 불러오기 START --
    $.ajax({
        url: backURL + 'user/',
        xhrFields: {
            withCredentials: true
        },
        success: function(jsonObj) {
            password = jsonObj.password
            $('input[name=email]').val(localStorage.getItem('loginedId'))
            $('input[name=name]').val(jsonObj.name)
            $('span.diligence').html(jsonObj.diligence + ' 점')
            $('span.balance').html(jsonObj.userBalance + ' 원')
        }, error: function(xhr) {
            alert(xhr.status)
        }
    })
    //-- 사용자 정보 불러오기 END --

    let sendData = {}
    //-- 사용자 이름 변경하기 START --
    $('#update_info').click(() => {
        sendData.name = $('input[name=name]').val()
        updateUser(sendData)
    })
    //-- 사용자 이름 변경하기 END --
    
    //-- 비밀번호 변경하기 START --
    $('#change_pwd').click(() => {
        if($('input[name=old_password]').val() != password) {
            alert('비밀번호가 틀립니다.')
            return false
        }
        sendData.password = $('input[name=password]').val()
        updateUser(sendData)
    })
    //-- 비밀번호 변경하기 END --

    //-- 사용자 정보 update Ajax START --
    function updateUser(sendData) {
        sendData.email = localStorage.getItem('loginedId')
        $.ajax({
            url: backURL + 'user/',
            method: 'put',
            xhrFields: {
                withCredentials: true
            },
            data: JSON.stringify(sendData),
            contentType: 'application/json',
            success: function() {
                alert('변경되었습니다.')
                location.reload
            }, error: function(xhr) {
                alert(xhr.status)
            }
        })
    }
    //-- 사용자 정보 update Ajax END --

    //-- 계정 삭제 START --
    $('#delete_user').click(() => {
        $.ajax({
            url: backURL + 'user/',
            method: 'delete',
            xhrFields: {
                withCredentials: true
            },
            success: function() {
                alert('삭제되었습니다.')
                localStorage.removeItem('loginedId')
                location.href = frontURL + 'index.html'
            }, error: function(xhr) {
                alert(xhr.status)
            }
        })
    })
    //-- 계정 삭제 END --
})