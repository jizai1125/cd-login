const $address = document.getElementById("Url");
const $username = document.getElementById("Username");
const $password = document.getElementById("Password");
const $pwdEye = document.getElementById("pwdEye");
const $saveBtn = document.getElementById("saveButton");
const $loginButton = document.getElementById("loginButton");
const $resetButton = document.getElementById("resetButton");
const $oaButton = document.getElementById("oaButton");

chrome.storage.local.get(["address", "username", "password"], (res) => {
  $address.value = res.address || "";
  $username.value = res.username || "";
  $password.value = res.password || "";
});

let showPwd = false;
$pwdEye.addEventListener("click", () => {
  showPwd = !showPwd;
  const src = showPwd ? `/images/eye.png` : `/images/no_eye.png`;
  $pwdEye.src = src;
  $password.type = showPwd ? "text" : "password";
});
$resetButton.addEventListener("click", () => {
  cleanForm();
});
$saveBtn.addEventListener("click", () => {
  saveForm();
  alert("保存成功！");
});
$loginButton.addEventListener("click", () => {
  const valid = this.validateForm();
  if (valid) {
    saveForm();
    chrome.runtime.sendMessage({ action: "login" });
  }
});
$oaButton.addEventListener("click", () => {
  window.open("https://oa-inner.citydo.com.cn/seeyon/main.do");
});

function validateForm() {
  let msg;
  if (!$address.value) {
    msg = "网址";
  } else if (!$username.value) {
    msg = "用户名";
  } else if (!$password.value) {
    msg = "密码";
  }
  if (msg) {
    alert(`请填写${msg}！`);
    return false;
  }
  return true;
}
function cleanForm() {
  $address.value = null;
  $username.value = null;
  $password.value = null;
  chrome.storage.local.clear();
}
function saveForm() {
  let address = $address.value;
  let username = $username.value;
  let password = $password.value;
  chrome.storage.local.set({ address, username, password });
}
