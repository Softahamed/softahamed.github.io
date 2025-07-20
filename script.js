// 🧭 Tab Switching (for auth.html)
const loginTab = document.getElementById('loginTab');
const signupTab = document.getElementById('signupTab');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

if (loginTab && signupTab && loginForm && signupForm) {
  loginTab.onclick = () => {
    loginTab.classList.add('active');
    signupTab.classList.remove('active');
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
  };

  signupTab.onclick = () => {
    signupTab.classList.add('active');
    loginTab.classList.remove('active');
    signupForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
  };
}

// 🔐 Handle Signup
function handleSignup() {
  const username = document.getElementById('newUsername').value.trim();
  const email = document.getElementById('newEmail').value.trim();
  const password = document.getElementById('newPassword').value.trim();
  const confirmPassword = document.getElementById('confirmPassword').value.trim();
  const signupError = document.getElementById('signupError');

  if (!username || !email || !password || !confirmPassword) {
    signupError.textContent = 'Please fill in all fields.';
    return;
  }

  if (password !== confirmPassword) {
    signupError.textContent = 'Passwords do not match.';
    return;
  }

  localStorage.setItem(username, JSON.stringify({ username, email, password }));
  signupError.textContent = '';
  alert(`Welcome, ${username}! Your Studio_MA account is ready ✨`);

  loginTab.click(); // Switch to login tab
}

// 🔓 Handle Login
function handleLogin() {
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const remember = document.getElementById('rememberMe')?.checked;
  const loginError = document.getElementById('loginError');

  const storedUser = localStorage.getItem(username);

  if (!storedUser) {
    loginError.textContent = 'User not found. Try signing up.';
    return;
  }

  const userData = JSON.parse(storedUser);
  if (userData.password !== password) {
    loginError.textContent = 'Incorrect password.';
    return;
  }

  loginError.textContent = '';
  if (remember) {
    localStorage.setItem('rememberUser', username);
  } else {
    localStorage.removeItem('rememberUser');
  }

  alert(`Welcome back, ${username}! 🎉`);
  window.location.href = 'dashboard.html';
}

// 🛎️ Auto-login on dashboard.html
const userGreeting = document.getElementById('userGreeting');
if (userGreeting) {
  const rememberedUser = localStorage.getItem('rememberUser');
  if (!rememberedUser) {
    window.location.href = 'auth.html';
  } else {
    userGreeting.textContent = `Hello, ${rememberedUser}! Your workspace awaits ✨`;
  }
}

// 🚪 Logout function
function handleLogout() {
  localStorage.removeItem('rememberUser');
  window.location.href = 'auth.html';
}

// 👤 Edit Profile (edit-profile.html)
const profileForm = document.getElementById('profileForm');
if (profileForm) {
  const username = localStorage.getItem('rememberUser');
  if (!username) window.location.href = 'auth.html';

  const profileKey = `${username}_profile`;
  const savedProfile = JSON.parse(localStorage.getItem(profileKey));

  if (savedProfile) {
    document.getElementById('fullName').value = savedProfile.fullName || '';
    document.getElementById('email').value = savedProfile.email || '';
    document.getElementById('phone').value = savedProfile.phone || '';
  }

  profileForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    localStorage.setItem(profileKey, JSON.stringify({ fullName, email, phone }));
    document.getElementById('statusMessage').textContent = 'Profile updated successfully ✅';
  });
}

// 🎬 Studio Booking (studio.html)
function bookStudio(e, studioType) {
  e.preventDefault();
  const form = e.target;
  const date = form.querySelector("input[type='date']").value;
  const time = form.querySelector("select").value;
  const notes = form.querySelector("textarea").value;
  const user = localStorage.getItem('rememberUser') || 'Guest';

  const booking = {
    user,
    studio: studioType,
    date,
    time,
    notes,
    id: 'BOOK' + Math.floor(Math.random() * 100000)
  };

  localStorage.setItem(`booking_${booking.id}`, JSON.stringify(booking));
  localStorage.setItem('latestBookingID', booking.id);
  alert(`✅ ${studioType} booked for ${date} at ${time}!\nBooking ID: ${booking.id}`);
  window.location.href = 'booking.html';

  emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
  user: booking.user,
  studio: booking.studio,
  date: booking.date,
  time: booking.time,
  notes: booking.notes || "—"
})
.then(() => {
  console.log("Email sent!");
})
.catch((error) => {
  console.error("EmailJS Error:", error);
});
}

// 📄 Booking Confirmation (booking.html)
const bookingSummary = document.getElementById('bookingSummary');
if (bookingSummary) {
  const latestID = localStorage.getItem('latestBookingID');
  const booking = latestID && JSON.parse(localStorage.getItem(`booking_${latestID}`));
  if (booking) {
    bookingSummary.innerHTML = `
      <strong>Studio:</strong> ${booking.studio} <br/>
      <strong>Date:</strong> ${booking.date} <br/>
      <strong>Time:</strong> ${booking.time} <br/>
      <strong>Notes:</strong> ${booking.notes || '—'} <br/>
      <strong>Booking ID:</strong> ${booking.id} <br/>
      <em>Booked by:</em> ${booking.user}
    `;
  } else {
    bookingSummary.textContent = 'No recent booking found.';
  }
}