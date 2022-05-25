const selectFieldOption = async (field, optionIndex) => {
  field.click();
  await waitForElement('mat-option');
  const options = document.querySelectorAll('mat-option');
  const option = options[optionIndex];
  option.click();
  await waitForLoading();
};

const checkSlots = (app) => {
  const continueButton = app.querySelector(
    '[mat-raised-button]:not([disabled])'
  );
  if (continueButton) {
    continueButton.click();
    waitForLoading().then(() =>
      chrome.runtime.sendMessage({ isSlotAvailable: true })
    );
  } else {
    chrome.runtime.sendMessage({ isSlotAvailable: false });
  }
};

const fillAppointmentDetails = async (app) => {
  await waitForLoading();
  const formFields = app.querySelectorAll('mat-select');
  // selecting centre
  await selectFieldOption(formFields[0], appointmentDetails.centre);
  // selecting category
  await selectFieldOption(formFields[1], appointmentDetails.category);
  // selecting sub-category
  await selectFieldOption(formFields[2], appointmentDetails.subCategory);
  checkSlots(app);
};

const fillLoginForm = async (app) => {
  const { email, password } = loginCreds;
  const emailInput = app.querySelector('#mat-input-0');
  const passwordInput = app.querySelector('#mat-input-1');
  emailInput.value = email;
  passwordInput.value = password;
  // triggering angular model changing
  emailInput.dispatchEvent(new Event('input'));
  passwordInput.dispatchEvent(new Event('input'));
  app.querySelector('.mat-raised-button').click();
  await waitForLoading();
};

const startNewBooking = async (app) => {
  app.querySelector('.mat-raised-button').click();
  await waitForLoading();
};

waitForElement('app-login').then((app) => fillLoginForm(app));
waitForElement('app-dashboard').then((app) => startNewBooking(app));
waitForElement('app-eligibility-criteria').then((app) => {
  fillAppointmentDetails(app);
});
