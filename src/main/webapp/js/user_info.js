$(function() {
    showMenu()
    let $section = $('section')
    
    $('nav>ul>li>a').click((e) => {
        let resource = $(e.target).attr('href');
        switch(resource) {
            case 'user_detail.html':
            case 'user_payment.html':
                $section.load(resource, function(responseTxt, statusTxt, xhr) {
                    if(xhr.status == 404) {
                        alert(statusTxt)
                    }
                })
                break;
            }
    })
})