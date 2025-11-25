import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureLedgerList } from './feature-ledger-list';

describe('FeatureLedgerList', () => {
  let component: FeatureLedgerList;
  let fixture: ComponentFixture<FeatureLedgerList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureLedgerList],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureLedgerList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
