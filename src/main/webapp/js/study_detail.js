$(function() {
    //-- 출석하기 요청을 위한 변수 세팅 START --
    let studyId =''
    let certification = ''
    let loginedId = localStorage.getItem('loginedId')
    //-- 출석하기 요청을 위한 변수 세팅 END --
    let queryStr = location.search.substr(1).split('=')
    $.ajax({
        xhrFields:{
            withCredentials: true
        },
        url: backURL + 'study/' + queryStr[1],
        success: function(jsonObj) {
            console.log(jsonObj)
            
            let study = jsonObj.study

            studyId = study.studyId
            certification = study.studyCertification
            let loginedUserHomeworkList = jsonObj.loginedStudyUser.homeworkList
            if(jsonObj.loginedStudyUser.email == null) {
                $('div.aside_atag').hide()
            } else if(checkHomework(loginedUserHomeworkList)) {
                $('div.aside_atag').show()
                $('div.homework_btn').hide()
                $('div.homework_done').show()
            }
            $('section >div span').html(study.studyPostDate)
            
            $('span.post_date').html()
            let subjectList =''
            $(study.subjects).each(function(index, s){
                subjectList += s.subject.subjectName + ' '
            })
            $('div [role= cell2]').html(subjectList)
            
            let studyCertification = study.studyCertification
            if(studyCertification == 1 ){
                $('div [role= cell4]').html('Github')
            }
            $('div [role= cell6]').html(study.studySize).append('명')
            $('div [role= cell8]').html(study.studyDiligenceCutline).append('점')
            $('div [role= cell10]').html(study.studyFee).append('원')
            $('div [role= cell12]').html('주당 '+ study.studyHomeworkPerWeek).append('회')
            $('div [role= cell14]').html(study.studyStartDate).append('일')
            $('div [role= cell16]').html(study.studyEndDate).append('일')
            $('textarea[name=studyContent]').val(study.studyContent)
            
            $('table> tbody>tr >th.leader').html(study.studyLeader.name)
            $('table> tbody>tr >td.diligence').html(study.studyLeader.diligence).append('점')
            $('table> tbody>tr >td.study_cnt').html(jsonObj.studyLeaderFinishStudy).append('회')
        }, error: function(xhr) {
            alert(xhr.status)
        }
    })
    
    // -- 출석여부 확인 START --
    function checkHomework(list) {
        let today = new Date()
        let todayStr = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate()
        let flag = false

        $.each(list, function(index, homework) {
            let submitDt = new Date(homework.studySubmitDt)
            let submitDtStr = submitDt.getFullYear() + '/' + (submitDt.getMonth() + 1) + '/' + submitDt.getDate()
            if(new Date(todayStr).getTime() == new Date(submitDtStr).getTime()) {
                flag = true
            }
        })
        return flag
    }
    // -- 출석여부 확인 END --

    //-- 출석하기 버튼 클릭 START --
    $('a.homework_btn').click(() => {
        
        if(loginedId != '' && loginedId != null) {
            let homeworkURL = ''
            switch(certification) {
                case 1:
                    homeworkURL = backURL + 'study/githomework/' + studyId
                break;
                case 0:
                    homeworkURL = backURL + 'study/homework/' + studyId
                break;
            }
            $.ajax({
                url: homeworkURL,
                xhrFields:{
                    withCredentials: true
                },
                method: 'post',
                success: function() {
                    alert('출석에 성공했습니다.')
                    location.reload()
                }, error: function() {
                    alert('출석에 실패했습니다.')
                    console.log()
                }
            })
        } else {
            alert('로그인해주세요')
            location.href = frontURL + 'user_login.html'
        }
    })
    //-- 출석하기 버튼 클릭 END --
})