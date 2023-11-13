const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

const handleChange = (e) => {
  e.preventDefault();
  helper.hideError();

  const pass = e.target.querySelector('#currentPass').value;
  const newPass = e.target.querySelector('#pass').value;
  const newPass2 = e.target.querySelector('#pass2').value;

  if(!pass || !newPass || !newPass2){
    helper.handleError('All fields are required!');
    return false;
  }

  if(newPass !== newPass2){
    helper.handleError('Passwords do not match!');
    return false;
  }

  helper.sendPost(e.target.action, {pass, newPass, newPass2});

  return false;
}

const ChangePasswordWindow = (props) => {
  return(
    <form id="changePasswordForm" name="changePasswordForm" onSubmit={handleChange} action="/changePassword" method="POST" className="mainForm">
      <label htmlFor="currentPass">Current Password: </label>
      <input id="currentPass" type="password" name="currentPass" placeholder="current password"/>
      <label htmlFor="pass">New Password: </label>
      <input id="pass" type="password" name="pass" placeholder="password"/>
      <label htmlFor="pass2">Re-type Password: </label>
      <input id="pass2" type="password" name="pass2" placeholder="retype password"/>
      <input class="formSubmit" type="submit" value="Change Password" />
    </form>
  );
}

const init = () => {
  ReactDOM.render(<ChangePasswordWindow />, document.getElementById('content'));
}

window.onload = init;