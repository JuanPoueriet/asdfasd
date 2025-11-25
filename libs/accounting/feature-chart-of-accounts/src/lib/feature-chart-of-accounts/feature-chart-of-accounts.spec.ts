import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureChartOfAccounts } from './feature-chart-of-accounts';

describe('FeatureChartOfAccounts', () => {
  let component: FeatureChartOfAccounts;
  let fixture: ComponentFixture<FeatureChartOfAccounts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureChartOfAccounts],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureChartOfAccounts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
