$(function() {

    $('img.github_mark').click(() => {
        $.ajax({
            url: backURL + 'getauthinfo',
            success: function(jsonObj) {
                console.log(jsonObj)
                let url = jsonObj.authorize_url
                url += '?client_id=' + jsonObj.client_id
                //url += '&redirect_uri=' + backURL + jsonObj.redirect_url.substr(1)
                url += '&redirect_uri=http://192.168.2.46:8888/mvc3/auth/github/callback'
                console.log(url)
                location.href= url
            }, error: function(xhr) {
            }
        })
    })
})