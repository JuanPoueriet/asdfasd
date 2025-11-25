import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureGeneralLedger } from './feature-general-ledger';

describe('FeatureGeneralLedger', () => {
  let component: FeatureGeneralLedger;
  let fixture: ComponentFixture<FeatureGeneralLedger>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureGeneralLedger],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureGeneralLedger);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
