
import { TaxType } from "@univeex/taxes/data-access";



export const panamaTaxTemplate = {
  countryCode: 'PA',
  taxes: [
    {
      name: 'ITBMS - 7%',
      rate: 7.00,
      type: TaxType.PERCENTAGE,
      countryCode: 'PA',
    }
  ],
};