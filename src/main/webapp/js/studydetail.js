$(function() {
    let queryStr = location.search.substr(1).split('=')
    $.ajax({
        xhrFields:{
            withCredentials: true
        },
        url: backURL + 'study/' + queryStr[1],
       
            success: function(jsonObj) {
                console.log(jsonObj)
              
                let study = jsonObj.study
                
                $('section >div span').html(study.studyPostDate)

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
                 
                $('table> tbody>tr >th.leader').html(study.studyLeader.name)
                $('table> tbody>tr >td.diligence').html(study.studyLeader.diligence)
                
            }, error: function(xhr) {
                alert(xhr.status)
            }
        })
      



})