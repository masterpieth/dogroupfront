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

    //-- 충전하기 버튼 클릭이벤트 START --
    let chargeIsShow = true
    $('input[name=charge]').click(() => {
        if(chargeIsShow) {
            chargeIsShow = false
            $('tr.charge_tr').show()
        } else {
            chargeIsShow = true
            $('tr.charge_tr').hide()
        }
    })
    //-- 충전하기 버튼 클릭이벤트 END --

    //-- 충전하기 START --
    $('#charge_btn').click(() => {
        if($('input[name=transactionMoney]').val() == '' || $('input[name=transactionMoney]').val() == 0) {
            alert('0원 이상의 금액을 입력해주세요')
            return false
        }
        if($('select[name=transactionUser]').val() == '선택') {
            alert('거래방식을 선택해주세요')
            return false
        }
        let sendData = {}
        sendData.transactionUser = $('select[name=transactionUser]').val()
        sendData.transactionMoney = $('input[name=transactionMoney]').val()
        sendData.email = localStorage.getItem('loginedId')
        $.ajax({
            url: backURL + 'wallet/deposit',
            method:'post',
            data: JSON.stringify(sendData),
            contentType: 'application/json',
            success: function() {
                alert('충전되었습니다.')
                location.reload()
            }, error: function(xhr) {
                alert(xhr)
            }
        })
        return false
    })
})