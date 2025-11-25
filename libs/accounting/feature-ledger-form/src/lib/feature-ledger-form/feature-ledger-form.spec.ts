import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureLedgerForm } from './feature-ledger-form';

describe('FeatureLedgerForm', () => {
  let component: FeatureLedgerForm;
  let fixture: ComponentFixture<FeatureLedgerForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureLedgerForm],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureLedgerForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
