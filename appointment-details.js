waitForElement('app-eligibility-criteria').then(app => {
    const centre = app.querySelector('#mat-select-0');
    const category = app.querySelector('#mat-select-2');
    const subCategory = app.querySelector('#mat-select-4');
    centre.click();
    waitForElement('#mat-option-1').then(centreOption => {
      centreOption.click();
      waitForLoading().then(() => {
          category.click();
          waitForElement('#mat-option-6').then(categoryOption => {
              categoryOption.click();
              waitForLoading().then(() => {
                subCategory.click();
                waitForElement('#mat-option-10').then(subCategoryOption => {

                });
              });
            });
        });
    });
  });
/* const app = document.querySelector('app-eligibility-criteria');
const centre = app.querySelector('.mat-select-0');
const category = app.querySelector('.mat-select-2');
const subCategory = app.querySelector('.mat-select-4');
console.log(centre);
console.log(category);
console.log(subCategory); */