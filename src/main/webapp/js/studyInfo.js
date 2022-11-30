$(function() {
	let queryStr = location.search
	let arr = queryStr.substr(1).split('=')
	$.ajax({
		url: backURL + 'studyInfo',
		data: arr[0]+'='+arr[1],
		success: function(jsonObj) {
			console.log(jsonObj)
			if(jsonObj.status == 1) {
				//스터디 정보 세팅
				let studyInfo = jsonObj.studyInfo 
				let $tbody = $('section > table > tbody')
				$tbody.find('tr:eq(0) > td').html(studyInfo.studyId)
				$tbody.find('tr:eq(1) > td').html(studyInfo.studyTitle)
				$tbody.find('tr:eq(2) > td').html(studyInfo.studySize + "명")
				$tbody.find('tr:eq(3) > td').html(studyInfo.studyFee + '원')
				let studyCertiStr = ''
				if(studyInfo.studyCertification == 1) {
					studyCertiStr = 'GitHub'
				} else {
					studyCertiStr = '버튼형'
				}
				$tbody.find('tr:eq(4) > td').html(studyCertiStr)
				$tbody.find('tr:eq(5) > td').html(studyInfo.studyDiligenceCutline + '점 이상')
				let postDate = new Date(studyInfo.studyPostDate)
				let dateStr = postDate.getFullYear() + '/' + (postDate.getMonth() + 1) + '/' + postDate.getDate()
				$tbody.find('tr:eq(6) > td').html(dateStr)
				let startDate = new Date(studyInfo.studyStartDate)
                dateStr = startDate.getFullYear() + '/' + (startDate.getMonth() + 1) + '/' + startDate.getDate()
				$tbody.find('tr:eq(7) > td').html(dateStr)
				let endDate = new Date(studyInfo.studyEndDate)
                dateStr = endDate.getFullYear() + '/' + (endDate.getMonth() + 1) + '/' + endDate.getDate()
				$tbody.find('tr:eq(8) > td').html(dateStr)
				$tbody.find('tr:eq(9) > td').html('주 ' + studyInfo.studyHomeworkPerWeek + ' 회')
				$tbody.find('tr:eq(10) > td').html(studyInfo.studyContent)
				
				//스터디장 정보 세팅
				let $aside = $('aside > table > tbody')
				let studyLeader = studyInfo.studyLeader
				let userId = studyLeader.email.substr(0, (studyLeader.email.indexOf('@')))
				$aside.find('tr:eq(0) > td').html(userId)
				$aside.find('tr:eq(1) > td').html(studyLeader.diligence + '점')
			} else {
				alert('값을 불러오지 못했습니다.');
			}
		}, error: function(xhr) {
			alert('오류:' + xhr.status)
		}
	})
})