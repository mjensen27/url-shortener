$(document).ready(()=>{
    $('#submit').on('click', ()=>{
        window.location.href = '/new/' + $('input').val();
    });
});