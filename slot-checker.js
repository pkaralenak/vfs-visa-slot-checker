const selectFieldOption = async (field, optionIndex) => {
  field.click();
  await waitForElement('mat-option');
  const options = document.querySelectorAll('mat-option');
  const option = options[optionIndex];
  option.click();
  await waitForLoading();
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

const pullNewSlots = async (formFields) => {
  console.log('pulling new slots');
  const tempOption = appointmentDetails.subCategory === 0 ? 1 : 0;
  // re-selecting sub-category for pulling new slots
  await selectFieldOption(formFields[2], tempOption);
  await selectFieldOption(formFields[2], appointmentDetails.subCategory);
};

const setUpPeriodicSlotsPulling = async (app) => {
  // await waitForLoading();
  const formFields = app.querySelectorAll('mat-select');
  const interval = setInterval(async () => {
    await pullNewSlots(formFields);
    const continueButton = app.querySelector(
      '[mat-raised-button]:not([disabled])'
    );
    if (continueButton) {
      clearInterval(interval);
      continueButton.click();
      waitForLoading().then(() =>
        chrome.runtime.sendMessage({ isSlotAvailable: true })
      );
    }
  }, checkPeriodInterval);
};

waitForElement('app-login').then((app) => fillLoginForm(app));
waitForElement('app-dashboard').then((app) => startNewBooking(app));
waitForElement('app-eligibility-criteria').then((app) => {
  fillAppointmentDetails(app);
  setUpPeriodicSlotsPulling(app);
});
/* waitForElement('[mat-raised-button]:not([disabled])').then((continueButton) => {
  clearInterval(interval);
  continueButton.click();
  waitForLoading().then(() =>
    chrome.runtime.sendMessage({ isSlotAvailable: true })
  );
}); */
