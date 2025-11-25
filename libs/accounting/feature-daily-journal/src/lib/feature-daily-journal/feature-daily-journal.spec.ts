import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureDailyJournal } from './feature-daily-journal';

describe('FeatureDailyJournal', () => {
  let component: FeatureDailyJournal;
  let fixture: ComponentFixture<FeatureDailyJournal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureDailyJournal],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureDailyJournal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
