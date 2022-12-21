$(function(){
    //로그인시 url queryStr에 이메일이 붙어옴
    let email = location.search.substr(7)
    if(email.length != 0) {
        localStorage.setItem('loginedId', email)
        history.replaceState({}, null, location.pathname)
    }
    showMenu()

    $('ul.user_nav li.logout a').click(() => {
        $.ajax({
            url: backURL + 'user/logout',
            xhrFields: {
                withCredentials: true
            },
            success: function () {
                localStorage.removeItem('loginedId')
                location.href=frontURL + 'index.html'
            }, error: function(xhr) {
                alert(xhr.status)
            }
        })
    })
})