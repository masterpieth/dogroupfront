$(function() {
    //-- 스터디 정보, 과목 정보 받아오기 START --
    let queryStr = location.search.substr(1).split('=')
    $.ajax({
        url: backURL + 'study/' + queryStr[1],
        data: queryStr[0] + '=' + queryStr[1],
        success: function(jsonObj) {
            console.log(jsonObj)
            let study = jsonObj.study
            let subjects = jsonObj.subjects
            $('input[name=email]').val(study.studyLeader.email)
            $('input[name=studyTitle]').val(study.studyTitle)
            $('select[name=studyCertification]').val(study.studyCertification)
            $('input[name=studyDiligenceCutline]').val(study.studyDiligenceCutline)
            $('select[name=studyHomeworkPerWeek]').val(study.studyHomeworkPerWeek)
            let startDate = new Date(study.studyStartDate)
            let endDate = new Date(study.studyEndDate)
            $('input[name=studyStartDate]').val(getDateString(startDate))
            $('input[name=studyEndDate]').val(getDateString(endDate))
            $('input[name=studySize]').val(study.studySize)
            $('input[name=studyFee]').val(study.studyFee)
            $('textarea[name=studyContent]').val(study.studyContent)
            setSubjects(study.subjects, subjects)
        }, error: function(xhr) {
            alert(xhr)
        }
    })
    //-- 스터디 정보, 과목 정보 받아오기 END --

    //-- Date 세팅을 위한 Date String 만들기 START --
    function getDateString(date) {
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()
        if(day < 10) {
            day = '0' + day
        }
        return year + '-' + month + '-' + day
    }
    //-- Date 세팅을 위한 Date String 만들기 START --

    //-- 과목 세팅 function START --
    function setSubjects(selectedSubject, allSubjects) {
        //선택된 과목 검색용 Obj 생성
        let selectedSubjectObj = {}
        $.each(selectedSubject, function(index, item) {
            let subjectCode = item.subject.subjectCode
            let subjectName = item.subject.subjectName
            selectedSubjectObj[subjectCode] = subjectName
        })
        //전체 과목을 순회하면서 Obj에 값이 있는경우에는 checked로 생성
        let str = ''
        $.each(allSubjects, function(index, item) {
            if(index % 5 == 0) {
                str += '<br>'
            }
            if(selectedSubjectObj[item.subjectCode] != undefined) {
                str += '&nbsp;<input type="checkbox" checked name="subject" value="' + item.subjectCode + '"><span> ' + item.subjectName +' </span>'
            } else {
                str += '&nbsp;<input type="checkbox" name="subject" value="' + item.subjectCode + '"><span> ' + item.subjectName +' </span>'
            }
        })
        $('div.study_subject').append(str)
    }
    //-- 과목 세팅 function END --

    //-- 스터디 수정버튼 클릭 START --
    $('#update_study_btn').click(() => {
        $('form').submit()
        return false
    })
    //-- 스터디 수정버튼 클릭 END --

    //-- 스터디 수정 START --
    $('form').submit(() => {
        let formDataArray = $('form').serializeArray()
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
        sendData.studyId = queryStr[1]
        sendData.subjects = subjects
        if(checkForm(subjects)) {
            $.ajax({
                xhrFields: {
                    withCredentials: true,
                },
                url: backURL + 'study/' + queryStr[1],
                method: 'put',
                data: JSON.stringify(sendData),
                contentType:'application/json',
                success: function() {
                    alert('스터디가 수정되었습니다.')
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
    //-- 스터디 수정 END --

    //-- 스터디 삭제 START --
    $('#delete_study_btn').click(() => {
        $.ajax({
            xhrFields: {
                withCredentials: true,
            },
            url: backURL + 'study/' + queryStr[1],
            method: 'delete',
            success: function() {
                alert('스터디가 삭제되었습니다.')
                location.href= frontURL + 'index.html'
            }, error: function(xhr) {
                alert(xhr)
            }
        })
    })
    //-- 스터디 삭제 END --

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