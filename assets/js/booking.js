/* ===================================================
   NINA HOTELS — BOOKING + WHATSAPP JS
   =================================================== */

const WHATSAPP_NUMBER = '2348062115796';

const ROOM_DATA = {
  Classic: {
    name: 'Classic Room',
    price: 18000,
    priceLabel: '₦18,000 / night',
    image: 'image/WhatsApp Image 2026-02-14 at 6.42.02 AM.jpeg'
  },
  Deluxe: {
    name: 'Deluxe Room',
    price: 25000,
    priceLabel: '₦25,000 / night',
    image: 'image/DELUX ROOM.jpeg'
  },
  Junior: {
    name: 'Junior Suite',
    price: 45000,
    priceLabel: '₦45,000 / night',
    image: 'image/JUNIOR SUITE.jpeg'
  },
  Executive: {
    name: 'Executive Suite',
    price: 75000,
    priceLabel: '₦75,000 / night',
    image: 'image/executive room.jpeg'
  },
  Presidential: {
    name: 'Presidential Suite',
    price: 90000,
    priceLabel: '₦90,000 / night',
    image: 'image/master room.jpeg'
  }
};

document.addEventListener('DOMContentLoaded', () => {

  /* ── Pre-fill from URL params ── */
  const params     = new URLSearchParams(window.location.search);
  const preRoom    = params.get('room');
  const preCheckIn = params.get('checkIn');
  const preCheckOut= params.get('checkOut');

  if (preCheckIn)  setVal('checkIn', preCheckIn);
  if (preCheckOut) setVal('checkOut', preCheckOut);
  if (preRoom)     setVal('roomType', preRoom);

  /* ── Room Type → Preview + Recalculate ── */
  const roomTypeSelect = document.getElementById('roomType');
  const roomPreview    = document.getElementById('roomPreview');
  const previewImg     = document.getElementById('previewImg');
  const previewName    = document.getElementById('previewName');
  const previewPrice   = document.getElementById('previewPrice');

  function updateRoomPreview(type) {
    const data = ROOM_DATA[type];
    if (data && roomPreview && previewImg && previewName && previewPrice) {
      previewImg.src              = data.image;
      previewName.textContent     = data.name;
      previewPrice.textContent    = data.priceLabel;
      roomPreview.classList.add('visible');
    } else {
      roomPreview?.classList.remove('visible');
    }
    recalculate();
  }

  roomTypeSelect?.addEventListener('change', function () {
    updateRoomPreview(this.value);
    clearError(this.closest('.form-group'));
  });

  if (preRoom && ROOM_DATA[preRoom]) {
    updateRoomPreview(preRoom);
  }

  /* ── Sidebar room option clicks ── */
  document.querySelectorAll('.room-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const type = opt.dataset.room;
      if (roomTypeSelect && type) {
        roomTypeSelect.value = type;
        updateRoomPreview(type);
        document.querySelector('.booking-form-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── Date Validation ── */
  const checkInInput  = document.getElementById('checkIn');
  const checkOutInput = document.getElementById('checkOut');

  if (checkInInput && checkOutInput) {
    const today = new Date().toISOString().split('T')[0];
    checkInInput.min  = today;
    checkOutInput.min = today;

    checkInInput.addEventListener('change', () => {
      if (checkInInput.value) {
        const nextDay = new Date(checkInInput.value);
        nextDay.setDate(nextDay.getDate() + 1);
        checkOutInput.min = nextDay.toISOString().split('T')[0];
        if (checkOutInput.value && checkOutInput.value <= checkInInput.value) {
          checkOutInput.value = '';
        }
      }
      recalculate();
      clearError(checkInInput.closest('.form-group'));
    });

    checkOutInput.addEventListener('change', () => {
      recalculate();
      clearError(checkOutInput.closest('.form-group'));
    });
  }

  /* ── Rooms count change → Recalculate ── */
  document.getElementById('rooms')?.addEventListener('change', recalculate);

  /* ── Form Submit → WhatsApp ── */
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validateForm()) return;
      sendToWhatsApp();
    });
  }

});

/* ── Live Price Calculator ── */
function recalculate() {
  const roomType  = document.getElementById('roomType')?.value;
  const checkIn   = document.getElementById('checkIn')?.value;
  const checkOut  = document.getElementById('checkOut')?.value;
  const roomCount = parseInt(document.getElementById('rooms')?.value) || 1;

  const summary   = document.getElementById('priceSummary');
  if (!summary) return;

  const data = ROOM_DATA[roomType];

  if (!data || !checkIn || !checkOut) {
    summary.classList.remove('active');
    return;
  }

  const nights = Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000);
  if (nights <= 0) {
    summary.classList.remove('active');
    return;
  }

  const total = data.price * roomCount * nights;

  document.getElementById('sumRoomType').textContent  = data.name;
  document.getElementById('sumNightRate').textContent = data.priceLabel;
  document.getElementById('sumRooms').textContent     = `${roomCount} room${roomCount > 1 ? 's' : ''}`;
  document.getElementById('sumNights').textContent    = `${nights} night${nights > 1 ? 's' : ''}`;
  document.getElementById('sumTotal').textContent     = formatNaira(total);

  summary.classList.add('active');
}

function formatNaira(amount) {
  return '₦' + amount.toLocaleString('en-NG');
}

/* ── Validation ── */
function validateForm() {
  const required = [
    { id: 'fullName', msg: 'Please enter your full name' },
    { id: 'email',    msg: 'Please enter your email address' },
    { id: 'phone',    msg: 'Please enter your phone number' },
    { id: 'checkIn',  msg: 'Please select a check-in date' },
    { id: 'checkOut', msg: 'Please select a check-out date' },
    { id: 'roomType', msg: 'Please select a room type' },
  ];

  let valid = true;

  required.forEach(({ id, msg }) => {
    const el = document.getElementById(id);
    if (!el) return;
    const group = el.closest('.form-group');
    if (!el.value.trim()) {
      setError(group, msg);
      valid = false;
    } else {
      clearError(group);
    }
  });

  const emailEl = document.getElementById('email');
  if (emailEl?.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
    setError(emailEl.closest('.form-group'), 'Please enter a valid email address');
    valid = false;
  }

  return valid;
}

function setError(group, msg) {
  if (!group) return;
  group.classList.add('has-error');
  let errEl = group.querySelector('.error-msg');
  if (!errEl) {
    errEl = document.createElement('span');
    errEl.className = 'error-msg';
    group.appendChild(errEl);
  }
  errEl.textContent    = msg;
  errEl.style.display  = 'block';
}

function clearError(group) {
  if (!group) return;
  group.classList.remove('has-error');
  const errEl = group.querySelector('.error-msg');
  if (errEl) errEl.style.display = 'none';
}

/* ── Build WhatsApp Message ── */
function sendToWhatsApp() {
  const get = id => document.getElementById(id)?.value?.trim() || '';

  const fullName       = get('fullName');
  const email          = get('email');
  const phone          = get('phone');
  const state          = get('state');
  const checkIn        = get('checkIn');
  const checkOut       = get('checkOut');
  const roomCount      = get('rooms');
  const adults         = get('adults');
  const children       = get('children');
  const destination    = get('destination');
  const roomType       = get('roomType');
  const roomTypeLabel  = ROOM_DATA[roomType]?.name || roomType;
  const roomPriceLabel = ROOM_DATA[roomType]?.priceLabel || '';
  const specialRequest = get('specialRequests');

  // Calculate nights & total
  let nightsStr = '', totalStr = '';
  if (checkIn && checkOut) {
    const nights = Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000);
    if (nights > 0) {
      nightsStr = `${nights} night${nights > 1 ? 's' : ''}`;
      const rooms = parseInt(roomCount) || 1;
      const price = ROOM_DATA[roomType]?.price || 0;
      if (price) totalStr = formatNaira(price * rooms * nights);
    }
  }

  const message =
`🏨 *NINA HOTELS — BOOKING REQUEST*
━━━━━━━━━━━━━━━━━━━━━━━━

👤 *Guest Details*
• Name:   ${fullName}
• Email:  ${email}
• Phone:  ${phone}
• State:  ${state || 'Not specified'}

📅 *Stay Details*
• Check-In:   ${formatDate(checkIn)}
• Check-Out:  ${formatDate(checkOut)}
• Duration:   ${nightsStr || 'N/A'}
• Rooms:      ${roomCount || '1'}
• Adults:     ${adults || '2'}
• Children:   ${children || '0'}
${destination ? `• Notes: ${destination}` : ''}

🛏️ *Room Details*
• Room Type:  ${roomTypeLabel}
• Rate:       ${roomPriceLabel}
${totalStr ? `• 💰 Estimated Total: *${totalStr}*` : ''}

📝 *Special Requests*
${specialRequest || 'None'}

━━━━━━━━━━━━━━━━━━━━━━━━
Please confirm my reservation. Thank you! 🙏`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

function formatDate(dateStr) {
  if (!dateStr) return 'Not selected';
  return new Date(dateStr).toLocaleDateString('en-NG', {
    weekday: 'short', year: 'numeric', month: 'long', day: 'numeric'
  });
}

function setVal(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value;
}
