$(function() {
	function showList(currentPage){
	    $.ajax({
	        url: backURL + 'studylist',
	        data : {
	                'currentPage' : currentPage
	        },
	        success: function(jsonObj) {
				console.log(jsonObj)
	            if(jsonObj.status == 1) {
	                let $trOrigin = $('table > tbody > tr:eq(0)')
	                $trOrigin.show()
					$('table > tbody').html('')
	                let myStudyList = jsonObj.pb.list
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
	                //페이지 목록 만들기
                    let startPage = jsonObj.pb.startPage                //페이지 목록 그룹에서의 시작 페이지
                    let endPage = jsonObj.pb.endPage                    //페이지 목록 그룹에서의 끝 페이지
                    let cntPerPageGroup = jsonObj.pb.cntPerPageGroup    //페이지 그룹수
                    let totalPage = jsonObj.pb.totalPage;               //총페이지수

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
                    $('div.pages>ul').html(liStr)
	            } else {
	                alert('데이터가 없습니다')
	            }
	        }, error: function(xhr) {
	            alert('오류:' + xhr.status)
	        }
	    })
    }
    showList(1)
    
    $('input.openStudy').click(() => {
		location.href = frontURL + '/html/studyInsertForm.html'
	})
    //—페이지 클릭이벤트 START—
    let $liPage = $('div.pages li')
    //DOM트리에 생성되지 않은 객체이벤트 처리는 on함수처리
    //$li.Page.click((e)=> {
    $('div.pages>ul').on('click', 'li', (e)=>{
    //$('DOM트리에 이미 생성되어 있는 요소').on.('click', '생성될 객체', (e)=>{)
        let currentPage = $(e.target).attr('class')
        showList(((currentPage == 'current') ? $(e.target).html() : currentPage))
    })
    //—페이지 클릭이벤트 END—
	
    //-- Page Navigation 세팅 END --
})