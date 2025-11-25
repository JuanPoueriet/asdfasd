import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureJournalForm } from './feature-journal-form';

describe('FeatureJournalForm', () => {
  let component: FeatureJournalForm;
  let fixture: ComponentFixture<FeatureJournalForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureJournalForm],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureJournalForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
