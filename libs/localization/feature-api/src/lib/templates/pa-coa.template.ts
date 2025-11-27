import { AccountNature, AccountType, AccountCategory } from "@univeex/chart-of-accounts/feature-api";
import { AccountTemplateDto } from "../entities/coa-template.entity";

interface CoaTemplateDefinition {
  countryCode: string;
  accounts: AccountTemplateDto[];
}

export const panamaCoaTemplate: CoaTemplateDefinition = {
  countryCode: 'PA',
  accounts: [
    {
      segments: ['100', '00'],
      name: 'Activos',
      type: AccountType.ASSET,
      category: AccountCategory.CURRENT_ASSET,
      nature: AccountNature.DEBIT,
      isPostable: false,
      children: [
        {
          segments: ['110', '00'],
          name: 'Activos Corrientes',
          type: AccountType.ASSET,
          category: AccountCategory.CURRENT_ASSET,
          nature: AccountNature.DEBIT,
          isPostable: false,
          children: [
            { segments: ['110', '01'], name: 'Efectivo y Equivalentes', type: AccountType.ASSET, category: AccountCategory.CURRENT_ASSET, nature: AccountNature.DEBIT, isPostable: true },
            { segments: ['110', '02'], name: 'Cuentas por Cobrar', type: AccountType.ASSET, category: AccountCategory.CURRENT_ASSET, nature: AccountNature.DEBIT, isPostable: true },
            { segments: ['110', '03'], name: 'Inventario', type: AccountType.ASSET, category: AccountCategory.CURRENT_ASSET, nature: AccountNature.DEBIT, isPostable: true },
          ]
        },
      ],
    },
    {
      segments: ['200', '00'],
      name: 'Pasivos',
      type: AccountType.LIABILITY,
      category: AccountCategory.CURRENT_LIABILITY,
      nature: AccountNature.CREDIT,
      isPostable: false,
      children: [
        {
          segments: ['210', '00'],
          name: 'Pasivos Corrientes',
          type: AccountType.LIABILITY,
          category: AccountCategory.CURRENT_LIABILITY,
          nature: AccountNature.CREDIT,
          isPostable: false,
          children: [
            { segments: ['210', '01'], name: 'Cuentas por Pagar', type: AccountType.LIABILITY, category: AccountCategory.CURRENT_LIABILITY, nature: AccountNature.CREDIT, isPostable: true },
            { segments: ['210', '02'], name: 'ITBMS por Pagar', type: AccountType.LIABILITY, category: AccountCategory.CURRENT_LIABILITY, nature: AccountNature.CREDIT, isPostable: true },
          ],
        }
      ],
    },
    {
        segments: ['300', '00'],
        name: 'Patrimonio',
        type: AccountType.EQUITY,
        category: AccountCategory.OWNERS_EQUITY,
        nature: AccountNature.CREDIT,
        isPostable: false,
        children: [
            { segments: ['310', '01'], name: 'Capital Social', type: AccountType.EQUITY, category: AccountCategory.OWNERS_EQUITY, nature: AccountNature.CREDIT, isPostable: true },
            { segments: ['310', '02'], name: 'Resultados Acumulados', type: AccountType.EQUITY, category: AccountCategory.RETAINED_EARNINGS, nature: AccountNature.CREDIT, isPostable: true },
        ]
    },
    {
        segments: ['400', '00'],
        name: 'Ingresos',
        type: AccountType.REVENUE,
        category: AccountCategory.OPERATING_REVENUE,
        nature: AccountNature.CREDIT,
        isPostable: false,
        children: [
            { segments: ['410', '01'], name: 'Ventas de Mercancía', type: AccountType.REVENUE, category: AccountCategory.OPERATING_REVENUE, nature: AccountNature.CREDIT, isPostable: true },
        ]
    },
    {
        segments: ['500', '00'],
        name: 'Gastos',
        type: AccountType.EXPENSE,
        category: AccountCategory.OPERATING_EXPENSE,
        nature: AccountNature.DEBIT,
        isPostable: false,
        children: [
            { segments: ['510', '01'], name: 'Gastos de Salarios', type: AccountType.EXPENSE, category: AccountCategory.OPERATING_EXPENSE, nature: AccountNature.DEBIT, isPostable: true },
            { segments: ['510', '02'], name: 'Gastos de Alquiler', type: AccountType.EXPENSE, category: AccountCategory.OPERATING_EXPENSE, nature: AccountNature.DEBIT, isPostable: true },
        ]
    }
  ],
};