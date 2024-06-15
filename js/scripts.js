// العنصر الخاص بالزر "احجز الآن"
var bookNowBtn = document.getElementById('book-now-btn');
// العنصر الخاص بالصفحة المنبثقة
var popup = document.getElementById('popup');
var popup2 = document.getElementById('popup2');
var arrowleft = document.getElementById('close-popup2-btn');
// عنصر الزر "احجز موعداً" داخل الصفحة المنبثقة
var makeAppointmentBtn = document.getElementById('make-appointment-btn');

// عند النقر على زر "احجز الآن"
bookNowBtn.addEventListener('click', function() {
    popup.style.display = 'flex'; // إظهار الصفحة المنبثقة
});

// عند النقر على زر "احجز موعداً" داخل الصفحة المنبثقة
makeAppointmentBtn.addEventListener('click', function() {
    // يمكنك تغيير الرابط هنا إلى رابط الصفحة التي تريد توجيه المستخدم إليها للحجز
    popup.style.display = 'none';
    popup2.style.display = 'flex';
});

// لإغلاق الصفحة المنبثقة عند النقر على الخلفية الظلامة أو أي مكان آخر
popup.addEventListener('click', function(event) {
    if (event.target === popup) {
        popup.style.display = 'none';
    }
});

arrowleft.addEventListener('click' , function()
{
    popup.style.display = 'flex';
    popup2.style.display = 'none';
});
