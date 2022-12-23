$(function() {
    let str = ''
    $(studyUserList).each(function(index, user){
        str += '<tr>'
        str += '<td>' + user.email + '</td>'
        str += '<td>' + user.homeworkList.length + '회</td>'
        str += '<td>' + user.diligence + '점</td>'
        str += '<td><a class="homework_detail">과제현황</a></td>'
        str += '</tr>'
    })
    $('table.study_users_list tbody').html(str)

    //-- 과제 현황 보기 START --
    $("a.homework_detail").click((e)=> {
        let $section = $('section.user_calendar')
        let email = $(e.target).closest('tr').find('td').html()
        $section.load('study_user_calendar.html', function(responseTxt, statusTxt, xhr){
            if(xhr.status == 404){
                alert(resource + '이 없습니다')
            }else if(xhr.status == 500){
                alert('서버 오류 확인하세요')
            }
            var calendarEl = document.getElementById('calendar');
            let studyId = location.search.substr(1).split('=')[1]
            data = {email}
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                url: backURL + 'study/users/' + studyId,
                method : 'post',
                data : JSON.stringify(data),          
                headers: {'Content-Type': 'application/json'},
                success: function(jsonObj){
                    var homework = new Array()
                    $(jsonObj.homeworkList).each(function(index, item) {
                        let obj = {}
                        obj['start'] = item.studySubmitDt
                        obj['title'] = email
                        obj['color'] = '#0078FF'
                        homework.push(obj)
                        //풀캘린더 start : value , title : value 설정 해서 homework에 푸쉬한다.
                    })
                    //console.log(homework) 0(index): {start: '2022-11-10', title: '완료'}... 

                    let today = new Date()
                    let initialDateStr = today.getFullYear() + '-' + (today.getMonth() + 1) + '-01'
                    var calendar = new FullCalendar.Calendar(calendarEl, {
                    headerToolbar: {
                        right: 'dayGridMonth',
                        right: 'prev,next today',
                    //달력 헤더 설정 
                    }, 
                    titleFormat : function(date) {
                    return date.date.year + '년 ' + (parseInt(date.date.month) + 1) + '월';
                    //달력 타이틀 설정
                    },
                    initialDate: initialDateStr,
                    events:  homework, 
                    //이벤트 설정 
                    eventColor: '#07ea18',   
                    });
                    calendar.render();
                    //달력 랜더링
                }, error: function(xhr) {
                    alert(xhr.status)
                }
            })       
        })
    })
    //-- 과제 현황 보기 END --

})