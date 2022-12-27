$(function() {
    if(localStorage.getItem('loginedId') == null) {
        alert('로그인해주세요')
        location.href = frontURL + 'user_login.html'
    }
    //-- 과목 정보 받아오기 START --
    $.ajax({
        url: backURL + 'study/subject/list/',
        success: function(jsonObj) {
            let str =''
            $.each(jsonObj, function(index, item) {
                if(index % 5 == 0) {
                    str += '<br>'
                }
                str += '<span class="subject">&nbsp;<input onclick="subjectValidation(this)" type="checkbox" name="subject" value="' + item.subjectCode + '"><span class="subjectname"> ' + item.subjectName +' </span></span>'
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
        let formDataArray = $('form').serializeArray()
        console.log(formDataArray)
        let sendData = {}
        let subjects = new Array()
        $.each(formDataArray, function(index, item) {
             if (item.name == 'subject') {
                let obj = {'subject' :
                    {'subjectCode' : item.value}
                }
                subjects.push(obj)
            } else if(item.name == 'email') {
                sendData.studyLeader = {'email' : item.value}
            } else {
                sendData[item.name] = item.value
            }
        })
        sendData.subjects = subjects
        if(checkForm(subjects)) {
            $.ajax({
                xhrFields: {
                    withCredentials: true,
                },
                url: backURL + 'study/',
                method: 'post',
                data: JSON.stringify(sendData),
                contentType:'application/json',
                success: function() {
                    alert('스터디가 개설되었습니다')
                    location.href= frontURL + 'index.html'
                }, error: function(xhr) {
                    alert(xhr.responseText)
                }
            })
            return false
        } else {
            return false
        }
    })
    //-- 스터디 개설 END --

    //-- Form 유효성 검사 START --
    function checkForm(subjects) {
        if($('input[name=studyTitle]').val() == '') {
            alert('스터디 제목을 입력하세요')
            return false
        }
        if($('select[name=studyCertification]').val() == '유형선택') {
            alert('스터디 유형을 선택하세요')
            return false
        }
        if($('input[name=studyDiligenceCutline]').val() == '') {
            alert('성실도 기준을 입력하세요')
            return false
        }
        if($('select[name=studyCertification]').val() == '빈도선택') {
            alert('인증 빈도를 선택하세요')
            return false
        }
        let today = new Date()
        let startDate = new Date($('input[name=studyStartDate]').val())
        if($('input[name=studyStartDate]').val() == '') {
            alert('시작일을 선택하세요')
            return false
        } else if(startDate < today) {
            alert('오늘 또는 오늘보다 이전 날짜는 선택할 수 없습니다')
            return false
        }
        if($('input[name=studyPeriod]').val() == '') {
            alert('스터디 진행 기간을 입력해주세요')
            return false
        }
        if($('input[name=studySize]').val() == '') {
            alert('모집인원을 입력해주세요')
            return false
        }
        if($('input[name=studyFee]').val() == '') {
            alert('참가비용을 입력해주세요')
            return false
        }
        if(subjects.length == 0) {
            alert('하나 이상의 과목을 선택해주세요')
            return false
        }
        if($('textarea[name=studyContent]').val() == '') {
            alert('스터디 내용을 입력해주세요')
            return false
        }
        return true
    }
    //-- Form 유효성 검사 END --

    //-- 스터디 기간(주차)설정 이벤트 START --
    $('div.study_date input[name=studyPeriod]').on("propertychange change keyup paste input", (e) => {
        $studyPeriod = $('div.study_date input[name=studyPeriod]')
        period = $studyPeriod.val()
        if($('input[name=studyStartDate]').val()=='') {
            alert('시작 날짜를 설정해주세요.')
            $studyPeriod.val('')
        }
        else {
            if(period>104) {$studyPeriod.val('104')}
            let $startDate = new Date($('input[name=studyStartDate]').val())
            let endDate = new Date()
            endDate.setDate($startDate.getDate() + Number(period)*7-1)
            let year = endDate.getFullYear()
            let month = ('0' + (endDate.getMonth() + 1)).slice(-2)
            let day = ('0' + endDate.getDate()).slice(-2)
            let endDateString = year + '-' + month  + '-' + day
            $('div.study_date input[name=studyEndDate]').val(endDateString)
        }
    })
    //-- 스터디 기간(주차)설정 이벤트 END --

    //-- 스터디 기간(주차)설정 초기화 이벤트 START--
    $('div.study_date input[name=studyStartDate]').on("propertychange change keyup paste input", (e) => {
        $('div.study_date input[name=studyPeriod]').val('')
        $('div.study_date input[name=studyEndDate]').val('')
    })
    //-- 스터디 기간(주차)설정 초기화 이벤트 END--

    //-- 스터디 유효성 검사 최댓값 설정 START--
    $('div.study_certification input[name=studyDiligenceCutline]').on("propertychange change keyup paste input", (e) => {
        if($('div.study_certification input[name=studyDiligenceCutline]').val()>999)
            $('div.study_certification input[name=studyDiligenceCutline]').val('999')
    })
    $('div.study_size_fee input[name=studySize]').on("propertychange change keyup paste input", (e) => {
        if($('div.study_size_fee input[name=studySize]').val()>100)
            $('div.study_size_fee input[name=studySize]').val('100')
    })
    $('div.study_size_fee input[name=studyFee]').on("propertychange change keyup paste input", (e) => {
        if($('div.study_size_fee input[name=studyFee]').val()>200000)
            $('div.study_size_fee input[name=studyFee]').val('200000')
    })
    //-- 스터디 유효성 검사 최댓값 설정 END--
})
//-- 과목 체크박스 선택 최대 3개 유효성 검사 함수 START--
let maxSubject = 3
let subjectCnt = 0
function subjectValidation(subject) {
    if(subject.checked) {
        subjectCnt++
    } else {
        subjectCnt--
    }
    if(subjectCnt>3) {
        alert("선택 가능한 과목은 최대 3개입니다.")
        subject.checked = false;
        subjectCnt--
    }
}
//-- 과목 체크박스 선택 최대 3개 유효성 검사 함수 END--