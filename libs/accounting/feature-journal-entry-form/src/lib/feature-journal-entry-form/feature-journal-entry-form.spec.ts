import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureJournalEntryForm } from './feature-journal-entry-form';

describe('FeatureJournalEntryForm', () => {
  let component: FeatureJournalEntryForm;
  let fixture: ComponentFixture<FeatureJournalEntryForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureJournalEntryForm],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureJournalEntryForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
