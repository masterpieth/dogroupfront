//let backURL = 'http://localhost:8888/dogroupback/'
//let frontURL = 'http://localhost:8888/dogroupfront'
let backURL = 'http://192.168.2.46:8888/dogroup/'
let frontURL = 'http://192.168.2.46:5500/src/main/webapp/html/'

//메뉴 토글: 로그인시에는 마이페이지/로그아웃, 로그아웃시에는 로그인/회원가입
function showMenu() {
    let loginedId = localStorage.getItem('loginedId')
    if(loginedId != null && loginedId.length != 0) {
        $('ul.user_nav li.mypage').show()
        $('ul.user_nav li.login').hide()
        $('ul.user_nav li.logout').show()
    } else {
        $('ul.user_nav li.mypage').hide()
        $('ul.user_nav li.login').show()
        $('ul.user_nav li.logout').hide()
    }
}