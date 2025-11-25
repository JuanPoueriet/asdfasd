import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureReconciliation } from './feature-reconciliation';

describe('FeatureReconciliation', () => {
  let component: FeatureReconciliation;
  let fixture: ComponentFixture<FeatureReconciliation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureReconciliation],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureReconciliation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
