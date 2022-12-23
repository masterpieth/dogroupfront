$(function() {
    //-- 출석하기 요청을 위한 변수 세팅 START --
    let studyId =''
    let certification = ''
    let loginedId = localStorage.getItem('loginedId')
    let studyFee = ''
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

            //-- 상단 변수 세팅 START --
            studyId = study.studyId
            certification = study.studyCertification
            studyFee = study.studyFee
            //-- 상단 변수 세팅 END --

            if(jsonObj.loginedStudyUser != null) {
                //-- 출석하기 버튼, 스터디 탈퇴 토글 START --
                let loginedUserHomeworkList = jsonObj.loginedStudyUser.homeworkList
                if(jsonObj.loginedStudyUser.email == null) {
                    $('div.aside_atag').hide()
                } else if(checkHomework(loginedUserHomeworkList)) {
                    $('div.aside_atag').show()
                    $('div.homework_btn').hide()
                    $('div.homework_done').show()
                } else if(!checkHomework(loginedUserHomeworkList)) {
                    $('div.aside_atag').show()
                    $('div.homework_btn').show()
                    $('div.homework_done').hide()
                }
                //-- 출석하기 버튼 토글 END --
    
                //-- 스터디 탈퇴 버튼 토글 START --
                if(jsonObj.loginedStudyUser.email == null) {
                    $('div.leave_study').hide()
                } else if(new Date() < new Date(study.studyStartDate)) {
                    $('div.leave_study').show()
                }
                //-- 스터디 탈퇴 버튼 토글 END --
            } else {
                if(new Date() < new Date(study.studyStartDate)) {
                    $('div.join_study').show()
                } else {
                    $('div.join_study').hide()
                }
            }

            //-- 스터디 내용 세팅 START --
            $('div.detail h2').html(study.studyTitle)
            $('section.content_section h3').html(study.studyPostDate)
            
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
            //-- 스터디 내용 세팅 END --

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
            if(new Date(todayStr).getTime() - new Date(submitDtStr).getTime() == 0) {
                flag = true
                return false
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
                }
            })
        } else {
            alert('로그인해주세요')
            location.href = frontURL + 'user_login.html'
        }
    })
    //-- 출석하기 버튼 클릭 END --

    //-- 스터디 탈퇴하기 버튼 클릭 START --
    $('a.leave_study_btn').click(() => {
        
    })
    //-- 스터디 탈퇴하기 버튼 클릭 END --

    //-- 스터디 참가신청 버튼 클릭 START --
    $('a.join_study').click(() => {
        $.ajax({
            url: backURL + 'user/',
            xhrFields: {
                withCredentials: true
            },
            success: function(jsonObj) {
                console.log(jsonObj)
                if(jsonObj.userBalance < studyFee) {
                    alert('지갑 잔액이 부족합니다.')
                    location.href = frontURL + 'user_detail.html'
                }
                //--스터디 참여 ajax START --
                let sendData = {}
                sendData.studyFee = studyFee
                sendData.studyId = studyId
                sendData.studyCertification = certification
                console.log(sendData)
                $.ajax({
                    url: backURL + 'study/join/' + studyId,
                    method: 'post',
                    data: JSON.stringify(sendData),
                    contentType: 'application/json',
                    xhrFields:{
                        withCredentials: true
                    },
                    success: function() {
                        alert('스터디 참여신청이 완료되었습니다.')
                        location.reload()
                    }, error: function(xhr) {
                        alert(xhr.responseText)
                    }
                })
                //--스터디 참여 ajax END --
            }, error: function(xhr) {
                alert('로그인 해주세요')
                location.href = frontURL + 'index.html'
            }
        })
    })
    //-- 스터디 참가신청 버튼 클릭 END --
    
    //--calendar 상세보기 버튼 클릭 START--
    let $section = $('section.content_section')
    $("nav>ul>li>a").click((e)=>{
        let resource =$(e.target).attr('href')
        switch(resource){
        case '':
        case 'calendar.html': 
            $section.load(resource, function(responseTxt, statusTxt, xhr){
                if(xhr.status == 404){
                    alert(resource + '이 없습니다')
                }else if(xhr.status == 500){
                    alert('서버 오류 확인하세요')
                }
            })
            break;
        }
        return false;
    })
    //--calendar 상세보기 버튼 클릭 END--
})