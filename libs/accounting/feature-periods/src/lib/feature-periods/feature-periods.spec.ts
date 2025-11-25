import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeaturePeriods } from './feature-periods';

describe('FeaturePeriods', () => {
  let component: FeaturePeriods;
  let fixture: ComponentFixture<FeaturePeriods>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturePeriods],
    }).compileComponents();

    fixture = TestBed.createComponent(FeaturePeriods);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
