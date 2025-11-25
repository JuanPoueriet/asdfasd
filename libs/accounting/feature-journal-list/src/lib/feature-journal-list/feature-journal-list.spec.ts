import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureJournalList } from './feature-journal-list';

describe('FeatureJournalList', () => {
  let component: FeatureJournalList;
  let fixture: ComponentFixture<FeatureJournalList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureJournalList],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureJournalList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
