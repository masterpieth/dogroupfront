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
                str += '<span class="subject">&nbsp;<input type="checkbox" name="subject" value="' + item.subjectCode + '"><span class="subjectname"> ' + item.subjectName +' </span></span>'
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
                    alert(xhr.status)
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
        let endDate = new Date($('input[name=studyEndDate]').val())
        if($('input[name=studyStartDate]').val() == '') {
            alert('시작일을 선택하세요')
            return false
        } else if(startDate < today) {
            alert('오늘 또는 오늘보다 이전 날짜는 선택할 수 없습니다')
            return false
        }
        if($('input[name=studyEndDate]').val() == '') {
            alert('종료일을 선택하세요')
            return false
        } else if(endDate < today) {
            alert('오늘 또는 오늘보다 이전 날짜는 선택할 수 없습니다')
            return false
        } else if(endDate < startDate) {
            alert('시작일은 종료일보다 앞이어야 합니다')
            return false
        }
        if((endDate.getDay() - startDate.getDay()) % 7 != 0) {
            alert('스터디 기간은 7일단위로 설정해주세요')
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
})