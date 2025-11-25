import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureJournalEntries } from './feature-journal-entries';

describe('FeatureJournalEntries', () => {
  let component: FeatureJournalEntries;
  let fixture: ComponentFixture<FeatureJournalEntries>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureJournalEntries],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureJournalEntries);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
