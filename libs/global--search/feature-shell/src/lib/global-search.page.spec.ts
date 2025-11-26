import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GlobalSearchPage } from './global-search.page';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('GlobalSearchPage', () => {
  let component: GlobalSearchPage;
  let fixture: ComponentFixture<GlobalSearchPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalSearchPage],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: of({
              get: (key: string) => null,
            }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GlobalSearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
