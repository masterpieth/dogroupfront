$(function(){
	console.log($('form').serialize())
	$('form>input[type=submit]').click(() => {
		$.ajax({
			url: backURL + 'studyInsert',
			method: 'post',
			data: $('form').serialize(),
			success: function(jsonObj) {
				console.log(jsonObj)
				if(jsonObj.status == 1) {
					alert(jsonObj)
					location.href = frontURL + '/html'
				}
			}, error: function(xhr) {
				alert(xhr.statusText)
			}
		})
	})
})