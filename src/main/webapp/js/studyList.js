$(function() {
    $.ajax({
        url: backURL + 'studylist',
        success: function(jsonObj) {
            console.log(jsonObj)
            if(jsonObj.status == 1) {
                let $trOrigin = $('table > tbody > tr:eq(0)')
                $trOrigin.show()
                let myStudyList = jsonObj.myStudyList
                $(myStudyList).each(function(index, s) {
                    let $trCopy = $trOrigin.clone();
                    $trCopy.find('td:eq(0)').html(s.studyId)
                    $trCopy.find('td:eq(1)').html('<a href="' + frontURL + '/html/studyInfo.html?studyId=' + s.studyId + '">' + s.studyTitle + '</a>')
                    $trCopy.find('td:eq(2)').html(s.studyDiligenceCutline + '이상')
                    $trCopy.find('td:eq(3)').html(s.studyFee + '원')
                    $trCopy.find('td:eq(4)').html(s.studySize + '명')
                    let userId = s.userEmail.substr(0, (s.userEmail.indexOf('@')))
                    $trCopy.find('td:eq(5)').html(userId)
                    let postDate = new Date(s.studyPostDate)
                    let dateStr = postDate.getFullYear() + '/' + (postDate.getMonth() + 1) + '/' + postDate.getDate()
                    $trCopy.find('td:eq(6)').html(dateStr)
                    let startDate = new Date(s.studyStartDate)
                    dateStr = startDate.getFullYear() + '/' + (startDate.getMonth() + 1) + '/' + startDate.getDate()
                    $trCopy.find('td:eq(7)').html(dateStr)
                    let endDate = new Date(s.studyEndDate)
                    dateStr = endDate.getFullYear() + '/' + (endDate.getMonth() + 1) + '/' + endDate.getDate()
                    $trCopy.find('td:eq(8)').html(dateStr)
                    let studyCertiStr = ''
                    if(s.studyCertification == 1) {
						studyCertiStr = 'GitHub'
					} else {
						studyCertiStr = '버튼형'
					}
	                $trCopy.find('td:eq(9)').html(studyCertiStr)
                    $trCopy.find('td:eq(10)').html('주 ' + s.studyHomeworkPerWeek + ' 회')
                    $('table > tbody').append($trCopy)
                })
                $trOrigin.hide()
            } else {
                alert('데이터가 없습니다')
            }
        }, error: function(xhr) {
            alert('오류:' + xhr.status)
        }
    })
    function lpad(str) {
		let strLen = str.length
		str = str.substr(0, strLen-2)
		while(str.length < strLen) {
			$(str).append('*')
		}
		return str
	}
})