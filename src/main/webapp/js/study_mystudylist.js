$(function(){
    showMenu()
    //--계정 유효성 테스트 START--
    let queryStr = location.search.substr(1).split('=')
    switch(queryStr[0]) {
        case 'status':
            alert('탈퇴한 회원입니다. 다른 계정으로 가입해주세요.')
            return false
        case 'email':
            localStorage.setItem('loginedId', queryStr[1])
            history.replaceState({}, null, location.pathname)
            return false
    }
    //--계정 유효성 테스트 END--

    //--로그아웃 START--
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
    //--로그아웃 END--
    
    //--검색조건 유효성검사 END--
    //--스터디 목록 보여주기 START--
    function showList(currentPage, option) {
        let studyAllList
        let $studylist = $('ul.study_list')
        let $studyOrigin = $('ul.study_list>li.study:first-child')
        $studyOrigin.show()
        $studylist.html('')
        $studylist.append($studyOrigin)
        $.ajax({
			 xhrFields : {
				withCredentials : true
            },
            url : backURL + 'study/my/list/' + currentPage,
            data : JSON.stringify(option),
            headers: {'Content-Type': 'application/json'},
            method : 'post',
            success : function(jsonObj){
                studyAllList = jsonObj.list
                $(studyAllList).each((index, study)=>{
                    let $studyCopy = $studyOrigin.clone()
                    let src = "../images/icons/" + study.subjects[0].subject.subjectName + ".svg"
                    $studyCopy.find('div.study_img_box>img').attr('src', src)
                    $studyCopy.find('div.studyid>span').html(study.studyId)
                    $studyCopy.find('div.startdate>span').html(study.studyStartDate)
                    $studyCopy.find('div.title>span').html(study.studyTitle)
                    $studyCopy.find('div.title>span').html(study.studyTitle)
                    $studyCopy.find('div.info>span').html(study.studyLeader.name + ' | ' + study.studyFee + '원 | ' + study.studyDiligenceCutline + '점 | ' + study.studyEndDate)
                    $studyCopy.find('div.subject>span').html(study.subjects[0].subject.subjectName+ ' | ' + study.subjects[1].subject.subjectName + ' | ' + study.subjects[2].subject.subjectName)
                    $studylist.append($studyCopy)
                })
                $studyOrigin.hide()
                filterStudy()
                //페이지 목록 만들기
                let startPage = jsonObj.startPage                //페이지 목록 그룹에서의 시작 페이지
                let endPage = jsonObj.endPage                    //페이지 목록 그룹에서의 끝 페이지
                let cntPerPageGroup = jsonObj.cntPerPageGroup    //페이지 그룹수
                let totalPage = jsonObj.totalPage;               //총페이지수
                let liStr = '';
                if(currentPage > (cntPerPageGroup/2 + 1)) {
                    liStr += '<li class="' + (startPage - 1) + '">PREV</li>'
                }
                for(let i=startPage; i<=endPage; i++){
                    liStr += (i==currentPage) ? '<li class="current">' + i + '</li>' : '<li class="' + i +'">' + i + '</li>'
                }
                if(currentPage < totalPage - (cntPerPageGroup/2)) {
                    liStr += '<li class="' + (endPage + 1) + '">NEXT</li>'
                }
                $('div.page_group>ul').html(liStr)
            },
            eroor : function(xhr){
                alert('오류 : ' + xhr)
            }
        })
    }
    //--스터디 목록 보여주기 END--

    option = {}
    showList(1, option)

    //--검색하기 클릭이벤트 START--
    $('div.search_form a.search_study_btn').click(()=>{
        let studyTitle = $('input[name=studyTitle]').val()
        let name = $('input[name=name]').val()
        let studyStartDate = $('input[name=studyStartDate]').val()
        let studyEndDate = $('input[name=studyEndDate]').val()
        let studySize = $('input[name=studySize]').val()
        let studyDiligenceCutline = $('input[name=studyDiligenceCutline]').val()
        let studyFee = $('input[name=studyFee]').val()
        option = {studyTitle, name, studyStartDate, studyEndDate, studySize, studyDiligenceCutline, studyFee}
        showList(1, option)
    })
    //--검색하기 클릭이벤트 START--

    //--스터디 클릭이벤트 START--
        $('ul.study_list').on('click', 'li.study', function(e) {
        let studyId = $(this).find('div.studyid>span').html()
        location.href = frontURL + 'study_detail.html?studyid=' + studyId
        return false
    })
    //--스터디 클릭이벤트 END--

    //--페이지 클릭이벤트 START--
    $('div.page_group>ul').on('click', 'li', (e)=>{
        let currentPage = $(e.target).attr('class')
        if(currentPage == 'current') { return false } 
        else { showList(currentPage, option) }
    })
    //--페이지 클릭이벤트 END--

    //--과목 체크이벤트 END--
    $('div.search_form input:checkbox').click((e)=>{
        filterStudy()
    })
    //--과목 선택이벤트 END--
    //--조건에 따라 보여줄 스터디 function
    function filterStudy() {
         $("li.study").each(function(index, element) {
            $(element).hide()
            if(index!=0 & subjectArr.length == 0) { 
                $(element).show()
            }
            else {
                subjectArr.forEach(function(subject, index1, array){
                    if(index!=0 & $(element).find('div.subject span').html().includes(subject)) {
                        $(element).show()
                    }
                })
            }
        })
    }
})
var subjectArr = new Array();
//필터 내용을 저장하는 function
function filter(target) {
    let subjectsVal = target.value //check value
    let confirmCheck = target.checked //check 여부 확인
    if(confirmCheck == true){
        subjectArr.push(subjectsVal); // check value filter 배열에 입력
    }else{
        subjectArr.splice(subjectArr.indexOf(subjectsVal), 1) // check value filter 배열내용 삭제            
    }
    //console.log("필터입력값 출력 : " + subjectArr)
}
//--검색조건 유효성검사 START--
function checkForm() {
    let today = new Date()
    let startDate = new Date($('input[name=studyStartDate]').val())
    let endDate = new Date($('input[name=studyEndDate]').val())
    if(startDate <= today) {
        alert('오늘 이전 날짜는 선택할 수 없습니다.')
        $('input[name=studyStartDate]').val('')
        return false
    }
        else if(endDate <= today) {
        alert('오늘 이전 날짜는 선택할 수 없습니다.')
        $('input[name=studyEndDate]').val('')
        return false
    } else if(endDate <= startDate) {
        alert('시작일은 종료일보다 앞서야합니다.')
        $('input[name=studyEndDate]').val('')
        return false
    }
    return ture
}
