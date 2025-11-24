import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardFeatureShell } from './dashboard-feature-shell';

describe('DashboardFeatureShell', () => {
  let component: DashboardFeatureShell;
  let fixture: ComponentFixture<DashboardFeatureShell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardFeatureShell],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardFeatureShell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
