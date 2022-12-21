$(function(){
    showMenu()
    logoutEvent()
    let queryStr = location.search.substr(1).split('=')
    console.log(queryStr)
    switch(queryStr[0]) {
        case 'status':
            alert('탈퇴된 회원입니다. 다른 계정으로 가입해주세요.')
            return false
        case 'email':
            localStorage.setItem('loginedId', queryStr[1])
            history.replaceState({}, null, location.pathname)
            showMenu()
            logoutEvent()
            return false
    }
    //-- 로그아웃 이벤트 연결 START -- 
    function logoutEvent() {
        $('ul.user_nav li.logout a').click(() => {
            console.log('머냐고')
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
    }
    //-- 로그아웃 이벤트 연결 END --
})