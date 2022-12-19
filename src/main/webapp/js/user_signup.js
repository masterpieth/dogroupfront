$(function() {
        let email = location.search.substr(7)
        history.replaceState({}, null, location.pathname);
        $('input[name=email]').val(email)

        $('#submit').click(() => {
                if($('input[name=password]').val() != $('input[name=passwordChk').val()) {
                        alert('비밀번호가 일치하지 않습니다.')
                        return false
                }
                $('form').submit()
                return false
        })
        $('form').submit(() => {
                let sendData = {}
                sendData.email = $('input[name=email]').val()
                sendData.password = $('input[name=password]').val()
                sendData.name = $('input[name=name]').val()

                $.ajax({
                        url: backURL + 'user/signup',
                        method: 'post',
                        data: JSON.stringify(sendData),
                        contentType: 'application/json',
                        success: function() {
                                alert(sendData.name + '님 가입을 환영합니다.')
                                location.href=frontURL + 'user_login.html'
                        }, error: function(xhr) {
                                alert(xhr.msg)
                        }
                })
                return false
        })
})