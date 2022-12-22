$(function() {
    $('img.github_mark').click(() => {
        $.ajax({
            url: backURL + 'user/login',
            xhrFields: {
                withCredentials: true
            },
            success: function(jsonObj) {
                let url = jsonObj.authorize_url
                url += '?client_id=' + jsonObj.client_id
                url += '&redirect_uri=' + backURL + jsonObj.redirect_url.substr(1)
                location.href= url
            }, error: function(xhr) {
                alert('오류가 발생했습니다.')
                location.href=frontURL + 'index.html'
            }
        })
    })

    $('img.kakao-logo').click(() => {
        loginWithKakao()
    })
    function loginWithKakao() {
    Kakao.Auth.authorize({
        redirectUri: 'http://192.168.2.46:8888/dogroup/user/auth/kakao/callback',
    });
    }
})