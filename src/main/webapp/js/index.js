$(function(){
    const header = document.querySelector('header');

    fetch('../html/header.html')
    .then(res => res.text())
    .then(data => header.innerHTML = data);
})