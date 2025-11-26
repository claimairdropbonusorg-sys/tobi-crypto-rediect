<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Modal Auth Buttons</title>
  <style>
    .auth-buttons {
      text-align: center;
      margin: 50px 0;
    }
    .btn {
      padding: 14px 32px;
      margin: 0 10px;
      font-size: 16px;
      font-weight: bold;
      border: none;
      border-radius: 50px;
      cursor: pointer;
      transition: 0.3s;
    }
    .btn-signin { background: #1da1f2; color: white; }
    .btn-signup { background: #e1306c; color: white; }
    .btn:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.2); }

    /* Modal Styles */
    .modal {
      display: none;
      position: fixed;
      z-index: 1000;
      left: 0; top: 0;
      width: 100%; height: 100%;
      background-color: rgba(0,0,0,0.5);
      align-items: center;
      justify-content: center;
    }
    .modal-content {
      background: white;
      padding: 30px;
      border-radius: 12px;
      width: 90%;
      max-width: 400px;
      position: relative;
    }
    .close {
      position: absolute;
      top: 10px;
      right: 15px;
      font-size: 28px;
      cursor: pointer;
    }
  </style>
</head>
<body>

  <div class="auth-buttons">
    <button class="btn btn-signin" onclick="openModal('signin')">Sign In</button>
    <button class="btn btn-signup" onclick="openModal('signup')">Sign Up</button>
  </div>

  <!-- Sign In Modal -->
  <div id="signinModal" class="modal">
    <div class="modal-content">
      <span class="close" onclick="closeModal('signin')">×</span>
      <h2>Sign In</h2>
      <form onsubmit="handleSignIn(event)">
        <input type="email" placeholder="Email" required style="width:100%; padding:10px; margin:10px 0; border-radius:8px; border:1px solid #ccc;">
        <input type="password" placeholder="Password" required style="width:100%; padding:10px; margin:10px 0; border-radius:8px; border:1px solid #ccc;">
        <button type="submit" class="btn btn-signin" style="width:100%; margin-top:15px;">Sign In</button>
      </form>
    </div>
  </div>

  <!-- Sign Up Modal -->
  <div id="signupModal" class="modal">
    <div class="modal-content">
      <span class="close" onclick="closeModal('signup')">×</span>
      <h2>Sign Up</h2>
      <form onsubmit="handleSignUp(event)">
        <input type="text" placeholder="Full Name" required style="width:100%; padding:10px; margin:10px 0; border-radius:8px; border:1px solid #ccc;">
        <input type="email" placeholder="Email" required style="width:100%; padding:10px; margin:10px 0; border-radius:8px; border:1px solid #ccc;">
        <input type="password" placeholder="Password" required style="width:100%; padding:10px; margin:10px 0; border-radius:8px; border:1px solid #ccc;">
        <button type="submit" class="btn btn-signup" style="width:100%; margin-top:15px;">Create Account</button>
      </form>
    </div>
  </div>

  <script>
    function openModal(type) {
      document.getElementById(type + 'Modal').style.display = 'flex';
    }

    function closeModal(type) {
      document.getElementById(type + 'Modal').style.display = 'none';
    }

    // Close modal when clicking outside
    window.onclick = function(e) {
      if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
      }
    }

    function handleSignIn(e) {
      e.preventDefault();
      alert('Sign In logic here (connect to your backend)');
      closeModal('signin');
    }

    function handleSignUp(e) {
      e.preventDefault();
      alert('Sign Up successful! (connect to your backend)');
      closeModal('signup');
    }
  </script>

</body>
</html>
