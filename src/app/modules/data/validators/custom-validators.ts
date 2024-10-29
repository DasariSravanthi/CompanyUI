import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CustomValidators {

    static integerValidator(control: AbstractControl): ValidationErrors | null {
        const value = control.value;

        // If the value not provided, return null (no error)
        if (!value) {
            return null;
        }

        // Check if the value is a number and an integer
        const isInteger = Number.isInteger(Number(value));

        return isInteger ? null : { notInteger: true };
    }

    static tinyintValidator(control: AbstractControl): ValidationErrors | null {
        const value = control.value;

        // If the value not provided, return null (no error)
        if (!value) {
            return null;
        }

        // Check if the value is an integer and is between 0 and 255
        const isTinyint = Number.isInteger(Number(value)) && Number(value) >= 0 && Number(value) <= 255;

        return isTinyint ? null : { notTinyint: true };
    }

    static smallintValidator(control: AbstractControl): ValidationErrors | null {
        const value = control.value;

        // If the value not provided, return null (no error)
        if (!value) {
            return null;
        }

        // Check if the value is an integer and is within the range of 0 and 65535
        const isSmallint = Number.isInteger(Number(value)) && Number(value) >= 0 && Number(value) <= 65535;

        return isSmallint ? null : { notSmallint: true };
    }

    static floatValidator(control: AbstractControl): ValidationErrors | null {
        const value = control.value;

        // If the value not provided, return null (no error)
        if (!value) {
            return null;
        }
        
        // Regex pattern for validating float
        const floatRegex = /^\d+(\.\d+)?$/;

        // Check if the value is a valid floating-point number
        const isFloat = !isNaN(value) && parseFloat(value) === Number(value);
        // const isFloat = floatRegex.test(value);

        return isFloat ? null : { notFloat: true };
    }

    static stringValidator(maxLength?: number) {
        return (control: AbstractControl): ValidationErrors | null => {
          const value = control.value;
          
          // If the value not provided, return null (no error)
          if (!value) {
            return null;
          }

          // Regex pattern for validating string
          const stringRegex = /^[a-zA-Z ]+$/;

          // Check if the value is a string and within the max length
          const isValidString = stringRegex.test(value) && (maxLength ? value.length <= maxLength : true);

          return isValidString ? null : { notString: true };
        };
    }

    static alphanumericValidator(maxLength?: number) {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
        
            // If the value not provided, return null (no error)
            if (!value) {
            return null;
            }
        
            // Regex pattern for validating alphanumeric values
            const alphanumericRegex = /^[a-zA-Z0-9]+$/;
        
            // Check if the value is a valid alphanumeric string and within the max length
            const isAlphanumeric = alphanumericRegex.test(value) && (maxLength ? value.length <= maxLength : true);
        
            return isAlphanumeric ? null : { notAlphanumeric: true };
        }
    }

    static dateValidator(control: AbstractControl): ValidationErrors | null {
        let value = control.value;

        let year!: number, month!: number, day!: number;
        let date!: Date;

        // If the value not provided, return null (no error)
        if (!value) {
            return null;
        }

        // Regex pattern for validating YYYY-MM-DD date format
        // const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      
        // Check if value matches the regex and can be converted to a valid date
        // const isValidDate = dateRegex.test(value) && !isNaN(Date.parse(value));

        if (typeof value === 'string') {

            [year, month, day] = value.split('-').map(Number);

            date = new Date(value);
        }
  
        // Check if the date is a valid Date object
        const isValidDate = date instanceof Date && 
                            (date.getFullYear() === year && 
                            date.getMonth() === month - 1 && 
                            date.getDate() === day);

        return isValidDate ? null : { invalidDate: true };
    }

    static timeValidator(control: AbstractControl): ValidationErrors | null {
        let value = control.value;

        // If the value not provided, return null (no error)
        if (!value) {
            return null;
        }

        // Regex pattern for validating HH:MM time format
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
      
        // Check if value matches the regex pattern
        const isValidTime = timeRegex.test(value);
      
        return isValidTime ? null : { invalidTime: true };
    }

}
