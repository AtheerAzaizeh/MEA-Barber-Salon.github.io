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
    bookNowBtn.style.display = 'none';
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

const schedule = {
    "Sunday": [],
    "Monday": [], // Closed
    "Tuesday": [],
    "Wednesday": [],
    "Thursday": [],
    "Friday": [],
    "Saturday": []
};

// Function to generate time slots with dates
function generateTimeSlots() {
    const days = ["Sunday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const startHour = 10;
    const endHour = 22;
    const slotDuration = 45; // in minutes

    days.forEach((day, index) => {
        let date = new Date();
        date.setDate(date.getDate() + (index - date.getDay() + 7) % 7); // Get the next specific day

        let time = new Date(date);
        time.setHours(startHour, 0, 0, 0);

        const dateString = date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit' ,
            year: '2-digit'
        });

        while (time.getHours() < endHour) {
            const slot = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            schedule[day].push({ date: dateString, time: slot });
            time.setMinutes(time.getMinutes() + slotDuration);
        }
    });
}


// Generate the time slots
generateTimeSlots();
const phoneNumber = document.getElementById('input-number');

document.getElementById("send-btn").addEventListener('click', function() {
   if(phoneNumber.value){
    popup2.style.display = 'none';
    showAvailableSlots();
   }
   else
   {
    alert('Please Enter Your Phone Number');
   }
});

function showAvailableSlots() {
    const schedulePopup = document.getElementById("schedule-popup");
    const scheduleDiv = document.getElementById("schedule");
    scheduleDiv.innerHTML = '';

    for (const day in schedule) {
        if (schedule.hasOwnProperty(day) && schedule[day].length > 0) {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'day';
            dayDiv.innerHTML = `<h3>${day} - ${schedule[day][0].date}</h3>`;

            schedule[day].forEach(slot => {
                const slotBtn = document.createElement('button');
                slotBtn.className = 'slot';
                slotBtn.innerText = slot.time;
                slotBtn.addEventListener('click', function() {
                    popup2.style.display = 'none';
                    bookSlot(day , slot);
                    showConfirmationPopup(day, slot);
                });

                dayDiv.appendChild(slotBtn);
            });

            scheduleDiv.appendChild(dayDiv);
        }
    }

    schedulePopup.style.display = 'inline-flex';
}


function showConfirmationPopup(day, slot) {
    const confirmationPopup = document.getElementById("confirmation-popup");
    confirmationPopup.style.display = 'block';

    document.getElementById("confirm-appointment-btn").addEventListener('click', function() {
        confirmAppointment(day, slot);
    });
}

function confirmAppointment(day, slot) {
    const firstName = document.getElementById("first-name").value;
    const lastName = document.getElementById("last-name").value;
    const phoneNumber = document.getElementById("input-number").value;

    if (firstName === '' || lastName === '' || phoneNumber === '') {
        alert('Please enter all details.');
        return;
    }

    // Remove slot from schedule
    const slotIndex = schedule[day].indexOf(slot);
    if (slotIndex > -1) {
        schedule[day].splice(slotIndex, 1);
    }

    // Send appointment details to server
    fetch('/save-appointment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ firstName, lastName, phoneNumber, day, slot })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(`You have successfully booked an appointment on ${slot}.\nName: ${firstName} ${lastName}`);
        } else {
            alert('Failed to book appointment.');
        }
    })
    .catch(error => {
        console.error('Error booking appointment:', error);
        alert('Failed to book appointment. Please try again.');
    });

    // Hide confirmation popup
    document.getElementById("confirmation-popup").style.display = 'none';
}

function bookSlot(day, slot) {
    // Remove slot from schedule
    const slotIndex = schedule[day].indexOf(slot);
    if (slotIndex > -1) {
        schedule[day].splice(slotIndex, 1);
    }

    // Hide schedule popup
    document.getElementById("schedule-popup").style.display = 'none';
}

// Close popup logic
document.getElementById("close-popup2-btn").addEventListener('click', function() {
    document.getElementById("popup2").style.display = 'none';
});
