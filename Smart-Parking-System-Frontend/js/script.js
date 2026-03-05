let map;
let currentRole = 'user'; // Default

// Init Map (Centered on Colombo)
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 6.9271, lng: 79.8612 },
        zoom: 14
    });
    // Placeholder markers
    new google.maps.Marker({ position: { lat: 6.9271, lng: 79.8612 }, map, title: 'Spot 1' });
}

// Search Parking (AJAX to backend)
function searchParking() {
    const location = $('#location-search').val();
    $.ajax({
        url: '/api/parking/search',
        data: { location: location || 'Colombo' },
        success: function(data) {
            $('#parking-list').empty();
            data.forEach(spot => {
                $('#parking-list').append(`
                    <div class="col-md-4">
                        <div class="card shadow-sm p-3">
                            <h5>${spot.address}</h5>
                            <p>Status: ${spot.status}</p>
                            <button class="btn btn-primary" onclick="openBooking('${spot.id}', '${spot.address}')">Book</button>
                        </div>
                    </div>
                `);
            });
        },
        error: function() {
            // Demo
            $('#parking-list').html(`
                <div class="col-md-4"><div class="card shadow-sm p-3"><h5>Colombo Spot</h5><p>Available</p><button class="btn btn-primary" onclick="openBooking('1', 'Colombo Spot')">Book</button></div></div>
            `);
        }
    });
}

// Open Booking
function openBooking(slotId, slotName) {
    $('#slot-name').val(slotName);
    $('#bookingModal').modal('show');
}

// Calculate Fee
function calculateFee() {
    const hours = parseInt($('#hours').val()) || 0;
    let fee = hours <= 3 ? 100 : 100 + (hours - 3) * 50;
    let commission = fee * 0.20;
    $('#total-fee').val(fee + ' LKR');
    $('#commission').val(commission + ' LKR');
}

// Book (AJAX)
function bookAppointment() {
    const data = {
        slotId: $('#slot-name').val(),
        start: $('#start-time').val(),
        end: $('#end-time').val(),
        hours: $('#hours').val()
    };
    $.ajax({
        url: '/api/appointment/book',
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: function() {
            $('#qr-code').show();
            alert('Booked!');
        },
        error: function() {
            alert('Error booking.');
        }
    });
}

// Role Switcher (Connects UI)
$('.dropdown-item[data-role]').click(function(e) {
    e.preventDefault();
    currentRole = $(this).data('role');
    $('.role-section').fadeOut(300);
    $(`#${currentRole}-dashboard`).fadeIn(300);
    $('html, body').animate({ scrollTop: $('#dashboard').offset().top }, 500); // Smooth scroll to dashboard
});

// On Load
$(document).ready(function() {
    initMap();
    searchParking();
    $('[data-bs-toggle="tooltip"]').tooltip();

    // Navbar scroll effect for professionalism
    $(window).scroll(function() {
        if ($(this).scrollTop() > 50) {
            $('.navbar').addClass('scrolled');
        } else {
            $('.navbar').removeClass('scrolled');
        }
    });
});