$(function() {
        let email = location.search.substr(7)
        history.replaceState({}, null, location.pathname);
        $('input[name=email]').val(email)
})